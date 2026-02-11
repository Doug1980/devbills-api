import { FastifyInstance } from "fastify"
import categoryRouters from "./category.routes"
import transactionsRoutes from "./transaction.routes";

async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/health', async () => {
        return {
            status: 'Ok',
            message: 'Devbills API rodando chuchu blz"'
        }
    })

    fastify.register(categoryRouters, {prefix: "/categories"});
    fastify.register(transactionsRoutes, { prefix: "/transactions" });
}

export default routes