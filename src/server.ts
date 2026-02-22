import { env } from "./config/env";
import app from "./app";
import  { prismaConnect } from "./config/prisma";
import { initializaGlobalCategories } from "./services/globalCategories.service";
import initizeFirebaseAdmin from "./config/firebase";

const PORT = env.PORT;

initizeFirebaseAdmin();
 
const startServer = async () => {

    try {

                
        await prismaConnect();

        await initializaGlobalCategories();

        await app.listen({ port: PORT }).then(() => {
            console.log(`Servidor rodando na porta ${PORT}`);
        })

    } catch (err) {
        console.error("Erro ao iniciar o servidor:", err); // ← era console.log(1)
        process.exit(1); // ← encerra o processo se falhar
    }
}

startServer();