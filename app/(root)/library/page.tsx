import React from 'react'
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BookCard from "@/components/BookCard";
import {getAllBooks} from "@/lib/actions/book.actions";
import Search from "@/components/Search";
import AppHeader from "@/components/AppHeader";
import { auth } from "@/lib/auth";
import { getServerTranslation } from "@/lib/i18n/server";

const Page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/sign-in?redirect=/library");
    }

    const { query } = await searchParams;
    const { t } = await getServerTranslation();

    const bookResults = await getAllBooks(query)
    const books = bookResults.success ? bookResults.data ?? [] : []

    return (
        <div className="library-dark">
            <AppHeader />

            <main className="library-main">
                <div className="library-title-row">
                    <h1 className="library-title">{t("library.title")}</h1>
                    <Search />
                </div>

                {books.length > 0 ? (
                    <div className="library-books-grid">
                        {books.map((book) => (
                            <BookCard key={book.id} id={book.id} title={book.title} author={book.author} coverURL={book.coverURL || "/images/book-placeholder.png"} slug={book.slug} />
                        ))}
                    </div>
                ) : (
                    <div className="library-empty-card">
                        <p>{t("library.empty")}</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Page
