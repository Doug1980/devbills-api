import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";
import type { CategorySummary } from "../../types/category.types";
import { TransactionType } from "@prisma/client";
import { TransactionSummary } from "../../types/transaction.type";
import { array } from "zod";

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

       let totalExpenses = 0;
       let totalIncomes = 0;
       const groupeExpenses = new Map<string, CategorySummary>();

       for(const transaction of transactions){
        if(transaction.type === TransactionType.expense){

            const existing = groupeExpenses.get(transaction.categoryId) ?? {
                categoryId: transaction.categoryId,
                categoryName: transaction.category.name,
                categoryColor: transaction.category.color,
                amount: 0,
                percentage: 0,
            };

            existing.amount += transaction.amount;
            groupeExpenses.set(transaction.categoryId, existing);

            totalExpenses += transaction.amount;
        }else {
            totalIncomes += transaction.amount;
        }
       }


       const summary:TransactionSummary = {
        totalExpenses, 
        totalIncomes,
        balance: Number((totalIncomes - totalExpenses).toFixed(2)),
        expensesByCategory: Array.from(groupeExpenses.values()).map((entry) => ({
            ...entry,
            percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2),)
        })).sort((a,b) => b.amount - a.amount),
       };

        reply.send(summary);
    }catch (err) {
        request.log.error("Erro ao obter transações", err);
        reply.status(500).send({error: "Erro no servidor" });
    }

};