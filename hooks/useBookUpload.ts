'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { upload } from '@vercel/blob/client';

import { authClient } from '@/lib/auth-client';
import { checkBookExists, createBook, saveBookSegments } from '@/lib/actions/book.actions';
import { parsePDFFile } from '@/lib/pdf';
import { BookUploadFormValues } from '@/types';

async function uploadCoverImage(
    fileTitle: string,
    coverImage: File | undefined,
    generatedCoverDataUrl: string,
): Promise<string> {
    if (coverImage) {
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverImage, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            contentType: coverImage.type,
        });
        return uploadedCoverBlob.url;
    }

    const response = await fetch(generatedCoverDataUrl);
    const blob = await response.blob();

    const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'image/png',
    });

    return uploadedCoverBlob.url;
}

// Orchestrates the full "add a new book" flow: pre-check, PDF parsing, blob
// uploads (pdf + cover, with a generated-cover fallback), and the createBook/
// saveBookSegments server actions. Returns true when the form should reset.
export function useBookUpload() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;
    const router = useRouter();

    const goToExistingBook = (slug: string) => {
        toast.info('Book with same title already exists.');
        router.push(`/books/${slug}`);
    };

    const submit = async (data: BookUploadFormValues): Promise<boolean> => {
        if (!userId) {
            router.push('/sign-in?reason=upload&redirect=/books/new');
            return false;
        }

        setIsSubmitting(true);

        try {
            const existsCheck = await checkBookExists(data.title);

            if (existsCheck.success && existsCheck.data.exists && existsCheck.data.book) {
                goToExistingBook(existsCheck.data.book.slug);
                return true;
            }

            const fileTitle = data.title.replace(/\s+/g, '-').toLowerCase();
            const pdfFile = data.pdfFile;

            const parsedPDF = await parsePDFFile(pdfFile);

            if (parsedPDF.content.length === 0) {
                toast.error('Failed to parse PDF. Please try again with a different file.');
                return false;
            }

            const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                contentType: 'application/pdf',
            });

            const coverUrl = await uploadCoverImage(fileTitle, data.coverImage, parsedPDF.cover);

            const createResult = await createBook({
                userId,
                title: data.title,
                author: data.author,
                persona: data.persona,
                fileURL: uploadedPdfBlob.url,
                fileBlobKey: uploadedPdfBlob.pathname,
                coverURL: coverUrl,
                fileSize: pdfFile.size,
            });

            if (!createResult.success || !createResult.data) {
                toast.error(createResult.error || 'Failed to create book');
                return false;
            }

            const { book, alreadyExists } = createResult.data;

            if (alreadyExists) {
                goToExistingBook(book.slug);
                return true;
            }

            const segments = await saveBookSegments(book.id, userId, parsedPDF.content);

            if (!segments.success) {
                toast.error('Failed to save book segments');
                return false;
            }

            router.push('/');
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload book. Please try again later.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submit, isSubmitting };
}
