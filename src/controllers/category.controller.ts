import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../config/prisma";

export const getCategories = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: "asc" },
		});
		reply.send(categories);
	} catch (err) {
		request.log.error("Erro ao buscar Categorias", err);
		reply.status(500).send({ error: "Erro ao buscar Categorias" });
	}
};

export const createCategory = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	try {
		const { name, type } = request.body as {
			name: string;
			type: "expense" | "income";
		};

		if (!name || !type) {
			return reply.status(400).send({ error: "Nome e tipo são obrigatórios" });
		}

		const category = await prisma.category.create({
			data: {
				name,
				type,
				color: type === "income" ? "#37E359" : "#FF5873", // cor padrão por tipo
			},
		});

		reply.status(201).send(category);
	} catch (err: any) {
		if (err.code === "P2002") {
			return reply
				.status(409)
				.send({ error: "Categoria já existe para este tipo" });
		}
		request.log.error("Erro ao criar categoria", err);
		reply.status(500).send({ error: "Erro ao criar categoria" });
	}
};
