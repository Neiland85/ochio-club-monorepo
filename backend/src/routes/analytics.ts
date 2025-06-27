import { FastifyInstance } from "fastify";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // Mapa de calor de fans
  fastify.get(
    "/analytics/heatmap",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      // Ejemplo: obtener ubicaciones recientes
      const locations = await fastify.prisma.userLocation.findMany({
        select: { latitude: true, longitude: true },
        where: {
          updatedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        },
      });
      return locations;
    },
  );

  // Asistencia por evento
  fastify.get(
    "/analytics/attendance",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      const attendance = await fastify.prisma.eventCheckin.groupBy({
        by: ["eventId"],
        _count: { id: true },
      });
      return attendance;
    },
  );
}
