import fp from "fastify-plugin";
import Redis from "ioredis";

export default fp(async (fastify) => {
  const redis = new Redis(process.env.REDIS_URL!);
  fastify.decorate("redis", redis);
});

// Ejemplo de uso en una ruta
// fastify.get('/cache-demo', async (request, reply) => {
//   const value = await fastify.redis.get('some-key');
//   if (value) return { value };
//   await fastify.redis.set('some-key', 'valor', 'EX', 60);
//   return { value: 'valor' };
// });
