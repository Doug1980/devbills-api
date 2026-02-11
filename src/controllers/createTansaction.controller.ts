import type { FastifyReply, FastifyRequest } from "fastify";
import type { TransactionType } from "@prisma/client";
import { createTansactionSchema } from "../schemas/transaction.schema";
import prisma from "../config/prisma";

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = "Avocado";

    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }

    const result = createTansactionSchema.safeParse(request.body);

    if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || "Validação Inválida";
        reply.status(400).send({ error: errorMessage });
        return;
    }

    const transaction = result.data;

    try {
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });

        if (!category) {
            reply.status(400).send({ error: "Categoria inválida" });
            return;
        }

        const newTransaction = await prisma.transaction.create({
            data: {
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                type: transaction.type as TransactionType,
                categoryId: transaction.categoryId,
                userId: userId,
            },
            include: {
                category: true,
            },
        });

        reply.status(201).send(newTransaction);

    } catch (err) {
        console.error("Erro ao criar Transação:", err);
        reply.status(500).send({ error: "Erro interno do servidor" });
    }
};

export default createTransaction;