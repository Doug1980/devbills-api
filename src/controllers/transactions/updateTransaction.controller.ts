import type { FastifyReply, FastifyRequest } from "fastify";
import type {
	UpdateTransactionBody,
	UpdateTransactionParams,
} from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";

export const updateTransaction = async (
	request: FastifyRequest<{
		Params: UpdateTransactionParams;
		Body: UpdateTransactionBody;
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	const { id } = request.params;
	const body = request.body;

	try {
		// ✅ verifica se a transação pertence ao usuário
		const existing = await prisma.transaction.findFirst({
			where: { id, userId },
		});

		if (!existing) {
			reply.status(404).send({ error: "Transação não encontrada" });
			return;
		}

		const updated = await prisma.transaction.update({
			where: { id },
			data: {
				...body,
				// ✅ converte date string para Date se vier no body
				...(body.date ? { date: new Date(body.date) } : {}),
			},
			include: {
				category: {
					select: { color: true, name: true, type: true },
				},
			},
		});

		reply.send(updated);
	} catch (err) {
		console.error(err);
		reply.status(500).send({ error: "Erro ao atualizar transação" });
	}
};
