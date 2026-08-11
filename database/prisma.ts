import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
    var prismaClient: PrismaClient | undefined;
}

// Global-cached like the old raw MongoClient was: Fluid Compute reuses warm
// instances across invocations, so caching avoids reconnecting every request.
// Not wrapped in a Proxy — adapters (e.g. better-auth's prismaAdapter) that
// introspect the client's methods can silently break behind one.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = global.prismaClient ?? (global.prismaClient = new PrismaClient({ adapter }));

export default prisma;
