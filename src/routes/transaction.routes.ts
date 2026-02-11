import { FastifyInstance } from "fastify";
import createTransaction from "../controllers/createTansaction.controller";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createTansactionSchema } from "../schemas/transaction.schema";


const transactionsRoutes = async(fastify: FastifyInstance) => {
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: zodToJsonSchema(createTansactionSchema),
        },
        handler: createTransaction,
    });
};



export default transactionsRoutes;