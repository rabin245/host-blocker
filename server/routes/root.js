export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return { root: true };
  });
}
