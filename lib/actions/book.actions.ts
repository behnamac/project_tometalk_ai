'use server';

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { ActionResult, CreateBook, CreateBookResult, IBook, TextSegment } from "@/types";
import * as bookService from "@/lib/services/book.service";

export const getAllBooks = async (search?: string): Promise<ActionResult<IBook[]>> => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'You must be signed in to view your library.' };
        }

        const books = await bookService.listBooks(userId, search);
        return { success: true, data: books };
    } catch (e) {
        console.error('Error fetching books', e);
        return { success: false, error: (e as Error).message };
    }
}

export const checkBookExists = async (title: string): Promise<ActionResult<{ exists: boolean; book?: IBook }>> => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'You must be signed in to add a book.' };
        }

        const book = await bookService.findBookByTitleForUser(title, userId);
        return { success: true, data: book ? { exists: true, book } : { exists: false } };
    } catch (e) {
        console.error('Error checking book exists', e);
        return { success: false, error: (e as Error).message };
    }
}

export const createBook = async (data: CreateBook): Promise<CreateBookResult> => {
    try {
        const outcome = await bookService.createBookForUser(data);
        return { success: true, data: outcome };
    } catch (e) {
        if (e instanceof bookService.BillingLimitError) {
            return { success: false, error: e.message, isBillingError: true };
        }
        console.error('Error creating a book', e);
        return { success: false, error: (e as Error).message };
    }
}

export const getBookBySlug = async (slug: string): Promise<ActionResult<IBook>> => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'You must be signed in to view this book.' };
        }

        const book = await bookService.findBookBySlugForUser(slug, userId);

        if (!book) {
            return { success: false, error: 'Book not found' };
        }

        return { success: true, data: book };
    } catch (e) {
        console.error('Error fetching book by slug', e);
        return { success: false, error: (e as Error).message };
    }
}

export const removeBook = async (bookId: string): Promise<ActionResult<{ removed: boolean }>> => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'You must be signed in to remove a book.' };
        }

        const removed = await bookService.deleteBookForUser(bookId, userId);

        if (!removed) {
            return { success: false, error: 'Book not found.' };
        }

        return { success: true, data: { removed } };
    } catch (e) {
        console.error('Error removing book', e);
        return { success: false, error: (e as Error).message };
    }
}

export const saveBookSegments = async (
    bookId: string,
    userId: string,
    segments: TextSegment[],
): Promise<ActionResult<{ segmentsCreated: number }>> => {
    try {
        const segmentsCreated = await bookService.saveSegmentsForBook(bookId, userId, segments);
        return { success: true, data: { segmentsCreated } };
    } catch (e) {
        console.error('Error saving book segments', e);
        return { success: false, error: (e as Error).message };
    }
}

// Searches book segments using Postgres full-text search with ILIKE fallback
export const searchBookSegments = async (
    bookId: string,
    query: string,
    limit: number = 5,
): Promise<ActionResult<bookService.BookSegmentResult[]>> => {
    try {
        const segments = await bookService.searchSegmentsForBook(bookId, query, limit);
        return { success: true, data: segments };
    } catch (e) {
        console.error('Error searching segments', e);
        return { success: false, error: (e as Error).message };
    }
};
