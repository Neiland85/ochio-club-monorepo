import { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/profile",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.id;
      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    },
  );
}
