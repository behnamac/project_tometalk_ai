-- DropIndex
DROP INDEX "Book_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_slug_key" ON "Book"("userId", "slug");
