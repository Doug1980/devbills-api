import { env } from "./config/env";
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { initializaGlobalCategories } from "./services/globalCategories.service";
import initizeFirebaseAdmin from "./config/firebase";

const PORT = env.PORT;

initizeFirebaseAdmin();

const startServer = async () => {
	try {
		await prismaConnect();
		await initializaGlobalCategories();

		// ✅ host: '0.0.0.0' necessário para o Render detectar a porta
		await app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
			console.log(`Servidor rodando na porta ${PORT}`);
		});
	} catch (err) {
		console.error("Erro ao iniciar o servidor:", err);
		process.exit(1);
	}
};

startServer();
