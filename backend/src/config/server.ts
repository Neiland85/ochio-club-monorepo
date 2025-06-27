// Fastify server configuration for better performance
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import Redis from "redis";
import { Server } from "socket.io";

// Initialize services
const prisma = new PrismaClient();
const redis = Redis.createClient({ url: process.env.REDIS_URL });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface ServerOptions {
  port: number;
  host: string;
  logger: boolean;
}

async function createServer(options: ServerOptions): Promise<FastifyInstance> {
  const server = Fastify({
    logger: options.logger,
    trustProxy: true,
  });

  // Security middleware
  await server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com"],
        scriptSrc: ["'self'", "https://api.mapbox.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "wss:", "https://api.mapbox.com"],
      },
    },
  });

  await server.register(cors, {
    origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:3000"],
    credentials: true,
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    redis,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET!,
  });

  // Add global decorators
  server.decorate("prisma", prisma);
  server.decorate("redis", redis);
  server.decorate("supabase", supabase);

  // Health check endpoint
  server.get("/health", async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      await redis.ping();
      return { status: "healthy", timestamp: new Date().toISOString() };
    } catch (error) {
      server.log.error(error);
      throw server.httpErrors.serviceUnavailable("Service unhealthy");
    }
  });

  // Socket.io integration
  const io = new Server(server.server, {
    cors: {
      origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:3000"],
      credentials: true,
    },
  });

  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = server.jwt.verify(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Socket.io event handlers
  io.on("connection", (socket) => {
    console.log(`User ${socket.data.user.id} connected`);

    // Join stadium room
    socket.on("join:stadium", (stadiumId: string) => {
      socket.join(`stadium:${stadiumId}`);
      console.log(`User joined stadium: ${stadiumId}`);
    });

    // Handle location updates
    socket.on(
      "location:update",
      async (data: { lat: number; lng: number; stadiumId?: string }) => {
        try {
          // Update user location in database
          await prisma.userLocation.upsert({
            where: { userId: socket.data.user.id },
            update: {
              latitude: data.lat,
              longitude: data.lng,
              updatedAt: new Date(),
            },
            create: {
              userId: socket.data.user.id,
              latitude: data.lat,
              longitude: data.lng,
            },
          });

          // Broadcast to stadium room if applicable
          if (data.stadiumId) {
            socket.to(`stadium:${data.stadiumId}`).emit("fan:location_update", {
              userId: socket.data.user.id,
              location: { lat: data.lat, lng: data.lng },
              timestamp: new Date(),
            });
          }
        } catch (error) {
          console.error("Error updating location:", error);
          socket.emit("error", "Failed to update location");
        }
      },
    );

    // Handle event check-ins
    socket.on("event:checkin", async (eventId: string) => {
      try {
        await prisma.eventCheckin.create({
          data: {
            userId: socket.data.user.id,
            eventId,
            checkedInAt: new Date(),
          },
        });

        // Broadcast to event room
        socket.to(`event:${eventId}`).emit("event:new_checkin", {
          userId: socket.data.user.id,
          eventId,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error checking in:", error);
        socket.emit("error", "Failed to check in");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.data.user.id} disconnected`);
    });
  });

  server.decorate("io", io);

  return server;
}

export default createServer;

// Type extensions for Fastify
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    redis: Redis.RedisClientType;
    supabase: any;
    io: Server;
  }
}
