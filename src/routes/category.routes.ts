import type { FastifyInstance } from "fastify";
import {
	createCategory,
	getCategories,
	updateCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const categoryRouters = async (fastify: FastifyInstance): Promise<void> => {
	fastify.addHook("preHandler", authMiddleware);
	fastify.get("/", getCategories);
	fastify.post("/", createCategory);
	// ✅ nova rota de atualização
	fastify.put("/:id", updateCategory);
};

export default categoryRouters;
