import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/database/mongoose";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { getUserPlan } from "@/lib/subscription.server";
import { PLAN_LIMITS } from "@/lib/subscription-constants";
import { escapeRegex, generateSlug, serializeData } from "@/lib/utils";
import { CreateBook, IBook, IBookSegment, TextSegment } from "@/types";

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

export type BookSegmentResult = Pick<
    IBookSegment,
    "_id" | "bookId" | "content" | "segmentIndex" | "pageNumber" | "wordCount"
>;

export async function listBooks(search?: string): Promise<IBook[]> {
    await connectToDatabase();

    let query = {};

    if (search) {
        const escapedSearch = escapeRegex(search);
        const regex = new RegExp(escapedSearch, "i");
        query = {
            $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }],
        };
    }

    const books = await Book.find(query).sort({ createdAt: -1 }).lean();
    return serializeData(books);
}

export async function findBookByTitle(title: string): Promise<IBook | null> {
    await connectToDatabase();

    const slug = generateSlug(title);
    const book = await Book.findOne({ slug }).lean();

    return book ? serializeData(book) : null;
}

export async function createBookForUser(data: CreateBook): Promise<CreateBookOutcome> {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId || userId !== data.userId) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();

    const slug = generateSlug(data.title);
    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
        return { book: serializeData(existingBook), alreadyExists: true };
    }

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const bookCount = await Book.countDocuments({ userId });

    if (bookCount >= limits.maxBooks) {
        throw new BillingLimitError(
            `You have reached the maximum number of books allowed for your ${plan} plan (${limits.maxBooks}). Please upgrade to add more books.`,
        );
    }

    const book = await Book.create({ ...data, userId, slug, totalSegments: 0 });
    revalidatePath("/library");

    return { book: serializeData(book), alreadyExists: false };
}

// Only returns the book if it belongs to the requesting user — prevents one
// user from reading another user's book by guessing/enumerating slugs.
export async function findBookBySlugForUser(slug: string, userId: string): Promise<IBook | null> {
    await connectToDatabase();

    const book = await Book.findOne({ slug, userId }).lean();
    return book ? serializeData(book) : null;
}

export async function saveSegmentsForBook(
    bookId: string,
    userId: string,
    segments: TextSegment[],
): Promise<number> {
    await connectToDatabase();

    const dbSession = await mongoose.startSession();

    try {
        await dbSession.withTransaction(async () => {
            const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
                userId,
                bookId,
                content: text,
                segmentIndex,
                pageNumber,
                wordCount,
            }));

            await BookSegment.insertMany(segmentsToInsert, { session: dbSession });
            await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length }, { session: dbSession });
        });
    } finally {
        await dbSession.endSession();
    }

    return segments.length;
}

// Searches book segments using MongoDB text search with a regex fallback.
export async function searchSegmentsForBook(
    bookId: string,
    query: string,
    limit: number = 5,
): Promise<BookSegmentResult[]> {
    await connectToDatabase();

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    let segments: BookSegmentResult[] = [];
    try {
        segments = await BookSegment.find({
            bookId: bookObjectId,
            $text: { $search: query },
        })
            .select("_id bookId content segmentIndex pageNumber wordCount")
            .sort({ score: { $meta: "textScore" } })
            .limit(limit)
            .lean();
    } catch {
        // Text index may not exist — fall through to regex fallback
        segments = [];
    }

    if (segments.length === 0) {
        const keywords = query.split(/\s+/).filter((k) => k.length > 2);
        const pattern = keywords.map(escapeRegex).join("|");

        segments = await BookSegment.find({
            bookId: bookObjectId,
            content: { $regex: pattern, $options: "i" },
        })
            .select("_id bookId content segmentIndex pageNumber wordCount")
            .sort({ segmentIndex: 1 })
            .limit(limit)
            .lean();
    }

    return serializeData(segments);
}
