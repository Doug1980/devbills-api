import { FastifyInstance } from "fastify"
import categoryRouters from "./category.routes"

async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/health', async () => {
        return {
            status: 'Ok',
            message: 'Devbills API rodando chuchu blz"'
        }
    })

    fastify.register(categoryRouters, {prefix: "/categories"});
}

export default routes