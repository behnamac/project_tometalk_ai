-- Full-text search support for BookSegment.content, replacing MongoDB's
-- { bookId: 1, content: 'text' } text index.
ALTER TABLE "BookSegment" ADD COLUMN "content_tsv" tsvector
  GENERATED ALWAYS AS (to_tsvector('english', "content")) STORED;

CREATE INDEX "book_segment_content_tsv_idx" ON "BookSegment" USING GIN ("content_tsv");
