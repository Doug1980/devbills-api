import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTansactionSchema = z.object({
    description: z.string().min(1, "Descrição obrigatória"),
    amount: z.number().positive("Valor deve ser positivo"),
    date: z.string().datetime().transform((str) => new Date(str)),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Inválida",
    }),
    type: z.string().refine(
        (val) => val === "expense" || val === "income",
        { message: "Tipo de transação inválido" }
    )
});

//  description String
//  amount      Float
//  date        DateTime
//  type        TransactionType