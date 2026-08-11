import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/database/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { getUserPlan } from "@/lib/subscription.server";
import { PLAN_LIMITS } from "@/lib/subscription-constants";
import { generateSlug } from "@/lib/utils";
import { CreateBook, IBook, TextSegment } from "@/types";

export class BillingLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BillingLimitError";
    }
}

export interface CreateBookOutcome {
    book: IBook;
    alreadyExists: boolean;
}

export interface BookSegmentResult {
    id: string;
    bookId: string;
    content: string;
    segmentIndex: number;
    pageNumber: number | null;
    wordCount: number;
}

export async function listBooks(search?: string): Promise<IBook[]> {
    return prisma.book.findMany({
        where: search
            ? {
                  OR: [
                      { title: { contains: search, mode: "insensitive" } },
                      { author: { contains: search, mode: "insensitive" } },
                  ],
              }
            : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export async function findBookByTitle(title: string): Promise<IBook | null> {
    const slug = generateSlug(title);
    return prisma.book.findUnique({ where: { slug } });
}

export async function createBookForUser(data: CreateBook): Promise<CreateBookOutcome> {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId || userId !== data.userId) {
        throw new Error("Unauthorized");
    }

    const slug = generateSlug(data.title);
    const existingBook = await prisma.book.findUnique({ where: { slug } });

    if (existingBook) {
        return { book: existingBook, alreadyExists: true };
    }

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const bookCount = await prisma.book.count({ where: { userId } });

    if (bookCount >= limits.maxBooks) {
        throw new BillingLimitError(
            `You have reached the maximum number of books allowed for your ${plan} plan (${limits.maxBooks}). Please upgrade to add more books.`,
        );
    }

    const book = await prisma.book.create({ data: { ...data, userId, slug, totalSegments: 0 } });
    revalidatePath("/library");

    return { book, alreadyExists: false };
}

// Only returns the book if it belongs to the requesting user — prevents one
// user from reading another user's book by guessing/enumerating slugs.
export async function findBookBySlugForUser(slug: string, userId: string): Promise<IBook | null> {
    return prisma.book.findFirst({ where: { slug, userId } });
}

// Scopes the delete to id + userId at the DB level so ownership is enforced
// atomically and existence of another user's book is never leaked.
export async function deleteBookForUser(bookId: string, userId: string): Promise<boolean> {
    const result = await prisma.book.deleteMany({ where: { id: bookId, userId } });

    if (result.count > 0) {
        revalidatePath("/library");
    }

    return result.count > 0;
}

export async function saveSegmentsForBook(
    bookId: string,
    userId: string,
    segments: TextSegment[],
): Promise<number> {
    const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
        userId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
    }));

    await prisma.$transaction([
        prisma.bookSegment.createMany({ data: segmentsToInsert }),
        prisma.book.update({ where: { id: bookId }, data: { totalSegments: segments.length } }),
    ]);

    return segments.length;
}

// Searches book segments using Postgres full-text search with an ILIKE fallback.
export async function searchSegmentsForBook(
    bookId: string,
    query: string,
    limit: number = 5,
): Promise<BookSegmentResult[]> {
    let segments = await prisma.$queryRaw<BookSegmentResult[]>`
        SELECT id, "bookId", content, "segmentIndex", "pageNumber", "wordCount"
        FROM "BookSegment"
        WHERE "bookId" = ${bookId}
          AND content_tsv @@ plainto_tsquery('english', ${query})
        ORDER BY ts_rank(content_tsv, plainto_tsquery('english', ${query})) DESC
        LIMIT ${limit}
    `;

    if (segments.length === 0) {
        const keywords = query.split(/\s+/).filter((k) => k.length > 2);

        if (keywords.length === 0) return [];

        // Parameterized ILIKE per keyword (not a hand-built regex) — no ReDoS
        // surface, so no escaping helper is needed.
        const keywordConditions = Prisma.join(
            keywords.map((k) => Prisma.sql`content ILIKE ${`%${k}%`}`),
            " OR ",
        );

        segments = await prisma.$queryRaw<BookSegmentResult[]>(Prisma.sql`
            SELECT id, "bookId", content, "segmentIndex", "pageNumber", "wordCount"
            FROM "BookSegment"
            WHERE "bookId" = ${bookId}
              AND (${keywordConditions})
            ORDER BY "segmentIndex" ASC
            LIMIT ${limit}
        `);
    }

    return segments;
}
