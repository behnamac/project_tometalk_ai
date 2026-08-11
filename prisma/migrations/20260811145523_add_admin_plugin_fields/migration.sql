-- AlterTable
-- Schema-qualified: the connecting role's search_path can resolve unqualified
-- "user"/"session" to a same-named table in a non-public schema (this project
-- has a Neon Auth-provisioned "neon_auth" schema with its own "user" table),
-- silently applying DDL to the wrong table.
ALTER TABLE public."session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE public."user" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "role" TEXT;
