import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSummaryQuery } from "../schemas/transaction.schema";
import prisma from "../config/prisma";

// Ative o plugin
dayjs.extend(utc);

export const getTransactionsSummary = async (
    request: FastifyRequest<{Querystring: GetTransactionsSummaryQuery}>,
    reply: FastifyReply,
    ):Promise<void> => {

    const userId = "Avocado";

    if(!userId) {
        reply.status(401).send({ error: "Usuario nao autenticado"});
        return;
    }

    const {month, year} = request.query;

    if(!month || !year) {
        reply.status(400).send({error: "Mês e ano são obrigatórios"});
        return;
    }

        const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs.utc(startDate).endOf("month").toDate();

     try{
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {date: "desc"},
            include: {
               category: true,
            },
        });

        console.log(transactions)

        reply.send(transactions);

    }catch (err) {
        request.log.error("Erro ao obter transações", err);
        reply.status(500).send({error: "Erro no servidor" });
    }

};