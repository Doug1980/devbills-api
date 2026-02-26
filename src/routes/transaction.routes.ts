import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

import {
	createTransactionSchema,
	deleteTransactionSchema,
	getTransactionsSchema,
	getTransactionsSummarySchema,
	getHistoricalTransactionsSchema,
} from "../schemas/transaction.schema";

import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controller";

const transactionsRoutes = async (fastify: FastifyInstance) => {
	fastify.addHook("preHandler", authMiddleware);

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
			querystring: zodToJsonSchema(getTransactionsSchema),
		},
		handler: getTransactions,
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

	//Histórico de transações
	fastify.route({
		method: "GET",
		url: "/historical",
		schema: {
			querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
		},
		handler: getHistoricalTransactions,
	});

	//Deletar
	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: zodToJsonSchema(deleteTransactionSchema),
		},
		handler: deleteTransaction,
	});
};

export default transactionsRoutes;
