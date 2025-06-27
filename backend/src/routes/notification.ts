import { FastifyInstance } from "fastify";

export default async function notificationRoutes(fastify: FastifyInstance) {
  // Enviar notificación push
  fastify.post(
    "/notifications",
    { preValidation: [fastify.authenticate] },
    async (request: any, reply: any) => {
      const { userId, message, type } = request.body;
      // Aquí podrías guardar la notificación en la base de datos si lo deseas
      // Emitir evento real-time (si tienes fastify.io configurado)
      if (fastify.io) {
        fastify.io.to(userId).emit("notification:push", { message, type });
      }
      return { ok: true };
    },
  );
}
