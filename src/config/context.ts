import { PrismaClient } from "@prisma/client";

let context: PrismaClient;

if (process.env.NODE_ENV === "production") {
    context = new PrismaClient();
} else {
    let globalWithPrisma = global as typeof globalThis & {
        context: PrismaClient;
    };
    if (!globalWithPrisma.context) {
        globalWithPrisma.context = new PrismaClient();
    }
    context = globalWithPrisma.context;
}

export default context;
