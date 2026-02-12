import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

// ✅ Schema para criação - SEM transform (compatível com zodToJsonSchema)
export const createTransactionSchema = z.object({
    description: z.string().min(1, "Descrição obrigatória"),
    amount: z.number().positive("Valor deve ser positivo"),
    date: z.string().datetime(), // ✅ Removido transform - faça no controller
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Inválida",
    }),
    type: z.enum(["expense", "income"])
});

// ✅ Schema para busca com filtros
export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum(["expense", "income"]).optional(),
    // ✅ Validação só quando categoryId existir
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Inválida",
    }).optional(),
});

// ✅ Schema para resumo
export const getTransactionsSummarySchema = z.object({
    month: z.string({ message: "O mês é obrigatório" }),
    year: z.string({ message: "O ano é obrigatório" }),
});

// ✅ Tipos inferidos
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;