import { FastifyInstance } from "fastify"

async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/health', async () => {
        return {
            status: 'Ok',
            message: 'Devbills API rodando chuchu blz"'
        }
    })

}

export default routes