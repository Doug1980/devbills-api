import prisma from "../src/config/prisma";

// ✅ UID do seu usuário principal (Google/GitHub)
const NEW_USER_ID = "5mFm5s72gPOOQ5q4fDseKe1iGjh1";

async function migrateUserId() {
	console.log("🔍 Buscando transações órfãs...");

	const transactions = await prisma.transaction.findMany({
		where: {
			NOT: { userId: NEW_USER_ID },
		},
	});

	console.log(`📊 Total encontrado: ${transactions.length}`);

	if (transactions.length === 0) {
		console.log("✅ Nenhuma transação para migrar!");
		await prisma.$disconnect();
		return;
	}

	const result = await prisma.transaction.updateMany({
		where: {
			NOT: { userId: NEW_USER_ID },
		},
		data: { userId: NEW_USER_ID },
	});

	console.log(`✅ ${result.count} transação(ões) migradas com sucesso!`);
	await prisma.$disconnect();
}

migrateUserId().catch((err) => {
	console.error("❌ Erro durante a migração:", err);
	prisma.$disconnect();
	process.exit(1);
});
