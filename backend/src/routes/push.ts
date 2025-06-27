// Importa la librería webpush para manejar notificaciones push
import webpush from "web-push";
import { FastifyInstance, FastifyReply } from "fastify";

// Configura tus claves VAPID
// Las claves VAPID son necesarias para autenticar el servidor y permitir el envío de notificaciones push.
// Estas claves deben ser generadas previamente y almacenadas de forma segura.
webpush.setVapidDetails(
  "mailto:admin@ochio.club", // Dirección de correo electrónico del administrador para contacto.
  process.env.VAPID_PUBLIC_KEY!, // Clave pública VAPID, utilizada para identificar el servidor.
  process.env.VAPID_PRIVATE_KEY!, // Clave privada VAPID, utilizada para firmar las notificaciones.
);

export default async function pushRoutes(fastify: FastifyInstance) {
  // Guardar suscripción push
  // Endpoint para registrar una suscripción de notificaciones push asociada a un usuario.
  fastify.post(
    "/push/subscribe",
    { preValidation: [fastify.authenticate] },
    async (request: any, reply: FastifyReply) => {
      const { subscription } = request.body; // La suscripción incluye información como endpoint, claves y opciones.
      const userId = request.user.id; // ID del usuario autenticado, obtenido del token JWT.

      // Guarda la suscripción en la base de datos asociada al usuario.
      // Si ya existe una suscripción para el usuario, se actualiza; de lo contrario, se crea una nueva.
      await fastify.prisma.pushSubscription.upsert({
        where: { userId },
        update: { subscription },
        create: { userId, subscription },
      });

      // Respuesta indicando que la operación fue exitosa.
      return { ok: true };
    },
  );

  // Enviar notificación push
  // Endpoint para enviar una notificación push a un usuario específico.
  fastify.post(
    "/push/send",
    { preValidation: [fastify.authenticate] },
    async (request: any, reply: FastifyReply) => {
      const { userId, title, body, url } = request.body; // Datos de la notificación: título, cuerpo y URL opcional.

      // Recupera la suscripción del usuario desde la base de datos.
      const sub = await fastify.prisma.pushSubscription.findUnique({
        where: { userId },
      });
      if (!sub) {
        // Si no se encuentra una suscripción, se devuelve un error 404.
        return reply.code(404).send({ error: "No subscription" });
      }

      // Crea el payload de la notificación en formato JSON.
      const payload = JSON.stringify({ title, body, url });

      // Envía la notificación utilizando la librería webpush.
      // Si ocurre un error durante el envío, este debe ser manejado adecuadamente.
      await webpush.sendNotification(sub.subscription, payload);

      // Respuesta indicando que la operación fue exitosa.
      return { ok: true };
    },
  );
}
