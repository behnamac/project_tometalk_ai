import React from 'react'
import BookCard from "@/components/BookCard";
import {getAllBooks} from "@/lib/actions/book.actions";
import Search from "@/components/Search";
import LibraryHeader from "@/components/LibraryHeader";

const Page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
    const { query } = await searchParams;

    const bookResults = await getAllBooks(query)
    const books = bookResults.success ? bookResults.data ?? [] : []

    return (
        <div className="library-dark">
            <LibraryHeader />

            <main className="library-main">
                <div className="library-title-row">
                    <h1 className="library-title">Your Library</h1>
                    <Search />
                </div>

                {books.length > 0 ? (
                    <div className="library-books-grid">
                        {books.map((book) => (
                            <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
                        ))}
                    </div>
                ) : (
                    <div className="library-empty-card">
                        <p>No books yet. Add your first book to get started.</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Page
