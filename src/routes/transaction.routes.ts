import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controller";
import { updateTransaction } from "../controllers/transactions/updateTransaction.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
	createTransactionSchema,
	deleteTransactionSchema,
	getTransactionsSchema,
	getTransactionsSummarySchema,
	getHistoricalTransactionsSchema,
	updateTransactionSchema,
	updateTransactionBodySchema,
} from "../schemas/transaction.schema";

const transactionsRoutes = async (fastify: FastifyInstance) => {
	// ✅ authMiddleware aplicado ANTES de todas as rotas
	fastify.addHook("preHandler", authMiddleware);

	// Criar
	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: zodToJsonSchema(createTransactionSchema),
		},
		handler: createTransaction,
	});

	// Buscar com filtro
	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: zodToJsonSchema(getTransactionsSchema),
		},
		handler: getTransactions,
	});

	// Resumo
	fastify.route({
		method: "GET",
		url: "/summary",
		schema: {
			querystring: zodToJsonSchema(getTransactionsSummarySchema),
		},
		handler: getTransactionsSummary,
	});

	// Histórico
	fastify.route({
		method: "GET",
		url: "/historical",
		schema: {
			querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
		},
		handler: getHistoricalTransactions,
	});

	// ✅ Atualizar — agora protegido pelo authMiddleware
	fastify.route({
		method: "PUT",
		url: "/:id",
		schema: {
			params: zodToJsonSchema(updateTransactionSchema),
			body: zodToJsonSchema(updateTransactionBodySchema),
		},
		handler: updateTransaction,
	});

	// Deletar
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
