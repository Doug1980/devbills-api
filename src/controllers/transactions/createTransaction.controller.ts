import type { FastifyReply, FastifyRequest } from "fastify";
import type { TransactionType } from "@prisma/client";
import { createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";

// ✅ limite diário de transações por usuário
const DAILY_TRANSACTION_LIMIT = 30;

const createTransaction = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuario nao autenticado" });
		return;
	}

	// Validação do body
	const result = createTransactionSchema.safeParse(request.body);

	if (!result.success) {
		const errorMessage =
			result.error.issues[0]?.message || "Validação inválida";
		reply.status(400).send({ error: errorMessage });
		return;
	}

	const { description, amount, date, type, categoryId } = result.data;

	try {
		// ✅ verifica o limite diário de transações
		const startOfDay = new Date();
		startOfDay.setUTCHours(0, 0, 0, 0);

		const endOfDay = new Date();
		endOfDay.setUTCHours(23, 59, 59, 999);

		const todayCount = await prisma.transaction.count({
			where: {
				userId,
				createdAt: {
					gte: startOfDay,
					lte: endOfDay,
				},
			},
		});

		if (todayCount >= DAILY_TRANSACTION_LIMIT) {
			reply.status(429).send({
				error: `Limite diário de ${DAILY_TRANSACTION_LIMIT} transações atingido. Tente novamente amanhã.`,
			});
			return;
		}

		// Verifica se a categoria existe e é do tipo correto
		const category = await prisma.category.findFirst({
			where: {
				id: categoryId,
				type: type,
			},
		});

		if (!category) {
			reply
				.status(400)
				.send({ error: "Categoria inválida para este tipo de transação" });
			return;
		}

		// ✅ Converte string para Date
		const dateObj = new Date(date);

		// Cria a transação
		const newTransaction = await prisma.transaction.create({
			data: {
				description,
				amount,
				date: dateObj,
				type: type as TransactionType,
				categoryId,
				userId,
			},
			include: {
				category: true,
			},
		});

		reply.status(201).send(newTransaction);
	} catch (err) {
		request.log.error("Erro ao criar transação:", err);
		reply.status(500).send({ error: "Erro interno do servidor" });
	}
};

export default createTransaction;
