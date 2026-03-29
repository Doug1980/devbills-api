import prisma from "../src/config/prisma";

async function cleanOrphanTransactions() {
	console.log("🔍 Buscando transações órfãs...");

	const transactions = await prisma.transaction.findMany();
	console.log(`📊 Total de transações encontradas: ${transactions.length}`);

	let deletedCount = 0;

	for (const transaction of transactions) {
		const category = await prisma.category.findUnique({
			where: { id: transaction.categoryId },
		});

		if (!category) {
			await prisma.transaction.delete({ where: { id: transaction.id } });
			console.log(
				`🗑️ Deletada transação órfã: ${transaction.id} - ${transaction.description}`,
			);
			deletedCount++;
		}
	}

	if (deletedCount === 0) {
		console.log("✅ Nenhuma transação órfã encontrada!");
	} else {
		console.log(
			`✅ Limpeza concluída! ${deletedCount} transação(ões) deletada(s).`,
		);
	}

	await prisma.$disconnect();
}

cleanOrphanTransactions().catch((err) => {
	console.error("❌ Erro durante a limpeza:", err);
	prisma.$disconnect();
	process.exit(1);
});
