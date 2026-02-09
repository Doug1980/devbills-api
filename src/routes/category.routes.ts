import type { FastifyInstance } from "fastify";
import { getCategories } from "../controllers/category.controller";


const categoryRouters = async (fastify: FastifyInstance): Promise<void> => {
    fastify.get("/", getCategories)

};

export default categoryRouters