import type { FastifyReply, FastifyRequest } from "fastify";
import type { TransactionType } from "@prisma/client";
import { createTransactionSchema } from "../schemas/transaction.schema";
import prisma from "../config/prisma";
import { error } from "node:console";

const createTransaction = async (
    request: FastifyRequest, 
    reply: FastifyReply
): Promise<void> => {
    //é necessario para video aula
    const userId = "Avocado";

    if(!userId) {
        reply.status(401).send({ error: "Usuario nao autenticado"});
        return;
    }

    // Validação do body
    const result = createTransactionSchema.safeParse(request.body);

    if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || "Validação inválida";
        reply.status(400).send({ error: errorMessage });
        return;
    }

    const { description, amount, date, type, categoryId } = result.data;

    try {
        // Verifica se a categoria existe e é do tipo correto
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                type: type,
            },
        });

        if (!category) {
            reply.status(400).send({ error: "Categoria inválida para este tipo de transação" });
            return;
        }

        // ✅ IMPORTANTE: Converte string para Date aqui
        const dateObj = new Date(date);

        // Cria a transação
        const newTransaction = await prisma.transaction.create({
            data: {
                description,
                amount,
                date: dateObj, // ✅ Agora é Date!
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
        request.log.error("Erro ao criar transação:", err); // ✅ Melhor usar request.log
        reply.status(500).send({ error: "Erro interno do servidor" });
    }
};

export default createTransaction;