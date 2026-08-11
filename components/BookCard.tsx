'use client';

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";
import { BookCardProps } from "@/types";
import { removeBook } from "@/lib/actions/book.actions";

const BookCard = ({ id, title, author, coverURL, slug }: BookCardProps) => {
    const [isPending, startTransition] = useTransition();
    const [isRemoved, setIsRemoved] = useState(false);

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm(`Remove "${title}" from your library?`)) return;

        startTransition(async () => {
            const result = await removeBook(id);

            if (result.success) {
                setIsRemoved(true);
            } else {
                toast.error(result.error || 'Failed to remove book');
            }
        });
    };

    if (isRemoved) return null;

    return (
        <article className="book-card relative">
            <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 disabled:opacity-50"
                aria-label={`Remove ${title} from library`}
            >
                <X size={16} />
            </button>

            <Link href={`/books/${slug}`}>
                <figure className="book-card-figure">
                    <div className="book-card-cover-wrapper">
                        <Image src={coverURL} alt={title} width={133} height={200} className="book-card-cover" />
                    </div>

                    <figcaption className="book-card-meta">
                        <h3 className="book-card-title">{title}</h3>
                        <p className="book-card-author">{author}</p>
                    </figcaption>
                </figure>
            </Link>
        </article>
    )
}
export default BookCard
