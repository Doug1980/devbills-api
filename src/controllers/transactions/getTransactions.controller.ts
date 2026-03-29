import dayjs from "dayjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.type";
import prisma from "../../config/prisma";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const getTransactions = async (
	request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	const { month, year, categoryId, type } = request.query;

	const filters: TransactionFilter = { userId };

	if (month && year) {
		// ✅ filtro mensal
		const startDate = dayjs
			.utc(`${year}-${month}-01`)
			.startOf("month")
			.toDate();
		const endDate = dayjs.utc(startDate).endOf("month").toDate();
		filters.date = { gte: startDate, lte: endDate };
	} else if (year && !month) {
		// ✅ filtro anual — quando só o year é passado
		const startDate = dayjs.utc(`${year}-01-01`).startOf("year").toDate();
		const endDate = dayjs.utc(`${year}-12-31`).endOf("year").toDate();
		filters.date = { gte: startDate, lte: endDate };
	}

	if (type) {
		filters.type = type;
	}

	if (categoryId) {
		filters.categoryId = categoryId;
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: filters,
			orderBy: { date: "desc" },
			include: {
				category: {
					select: {
						color: true,
						name: true,
						type: true,
					},
				},
			},
		});

		// ✅ segurança extra contra transações órfãs
		const validTransactions = transactions.filter((t) => t.category !== null);

		reply.send(validTransactions);
	} catch (err) {
		console.error({ err }, "Erro ao obter transações", err);
		reply.status(500).send({ error: "Erro no servidor" });
	}
};
