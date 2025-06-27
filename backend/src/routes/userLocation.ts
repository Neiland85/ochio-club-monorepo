import { FastifyInstance } from "fastify";

export default async function userLocationRoutes(fastify: FastifyInstance) {
  // Actualizar ubicación del usuario
  fastify.post(
    "/users/location",
    { preValidation: [fastify.authenticate] },
    async (request: any, reply) => {
      const { latitude, longitude } = request.body;
      const userId = request.user.id;
      await fastify.prisma.userLocation.upsert({
        where: { userId },
        update: { latitude, longitude, updatedAt: new Date() },
        create: { userId, latitude, longitude },
      });
      // Emitir evento real-time (si tienes fastify.io configurado)
      if (fastify.io) {
        fastify.io.emit("fan:location_update", { userId, latitude, longitude });
      }
      return { ok: true };
    },
  );

  // Obtener fans cercanos a un estadio
  fastify.get(
    "/stadiums/:id/fans",
    { preValidation: [fastify.authenticate] },
    async (request: any, reply) => {
      const stadiumId = request.params.id;
      // Obtener estadio
      const stadium = await fastify.prisma.stadium.findUnique({
        where: { id: stadiumId },
      });
      if (!stadium) return reply.code(404).send({ error: "Stadium not found" });
      // Buscar fans a 2km (ejemplo)
      const fans = await fastify.prisma.userLocation.findMany({
        where: {
          latitude: {
            gte: stadium.latitude - 0.02,
            lte: stadium.latitude + 0.02,
          },
          longitude: {
            gte: stadium.longitude - 0.02,
            lte: stadium.longitude + 0.02,
          },
        },
        include: { user: true },
      });
      return fans;
    },
  );
}
