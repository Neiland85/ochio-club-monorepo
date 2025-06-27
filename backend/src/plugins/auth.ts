import { FastifyInstance } from "fastify";
import { createClient } from "@supabase/supabase-js";

export default async function (fastify: FastifyInstance) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );

  fastify.decorate("authenticate", async (request: any, reply: any) => {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) return reply.code(401).send({ error: "No token" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user)
      return reply.code(401).send({ error: "Invalid token" });

    request.user = data.user;
  });
}
