import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Real credentials live in .env.local (Next.js convention, populated via
// `vercel env pull`) — not the placeholder .env Prisma scaffolds by default.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations must bypass Neon's pooler, so point the CLI at the direct URL.
    url: process.env["DATABASE_URL_UNPOOLED"],
  },
});
