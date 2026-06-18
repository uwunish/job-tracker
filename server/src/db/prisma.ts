import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import "dotenv/config";

declare global {
	var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
	const adapter = new PrismaPg({
		connectionString: process.env.DATABASE_URL,
	});

	return new PrismaClient({
		adapter,
		log: ["error", "warn"],
	});
}

const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalThis.prisma = prisma;
}

export default prisma;
