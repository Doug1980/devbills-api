import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/createTransaction.controller";
import { getTransactions } from "../controllers/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/getTransactionsSummary.controller";

import { createTransactionSchema, getTransactionsSchema, getTransactionsSummarySchema } from "../schemas/transaction.schema";

const transactionsRoutes = async(fastify: FastifyInstance) => {

    //Criate
    fastify.route({ 
        method: "POST",
        url: "/",
        schema: {
            body: zodToJsonSchema(createTransactionSchema),
        },
        handler: createTransaction,
    });


    //Search with Filter
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSchema)
        },
        handler: getTransactions
    });

    //Obter Resumo
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSummarySchema),
        },
        handler: getTransactionsSummary,
    });

};



export default transactionsRoutes;