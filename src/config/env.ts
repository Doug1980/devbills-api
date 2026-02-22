import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().transform(Number).default("3001"),
    DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
    NODE_ENV: z.enum(["dev", "test", "prod"], {
        message: "NODE_ENV deve ser dev, test ou prod",
    }),

    // FIREBASE
    FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID é obrigatório"),
    FIREBASE_PRIVATE_KEY: z.string().min(1, "FIREBASE_PRIVATE_KEY é obrigatório"),
    FIREBASE_CLIENT_EMAIL: z.string().email("FIREBASE_CLIENT_EMAIL inválido"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Variáveis de ambiente INVÁLIDAS:");
    console.error(_env.error.format()); // mostra exatamente qual variável falhou
    process.exit(1);
}

export const env = _env.data;