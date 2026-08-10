'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ImageIcon } from 'lucide-react';
import { UploadSchema } from '@/lib/zod';
import { BookUploadFormValues } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import FileUploader from './FileUploader';
import VoiceSelector from './VoiceSelector';
import LoadingOverlay from './LoadingOverlay';
import {authClient} from "@/lib/auth-client";
import { toast } from 'sonner';
import {checkBookExists, createBook, saveBookSegments} from "@/lib/actions/book.actions";
import {useRouter} from "next/navigation";
import {parsePDFFile} from "@/lib/utils";
import {upload} from "@vercel/blob/client";

type Step = 1 | 2 | 3;

const STEPS: { step: Step; label: string }[] = [
    { step: 1, label: 'Upload' },
    { step: 2, label: 'Details' },
    { step: 3, label: 'Voice' },
];

const UploadForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [step, setStep] = useState<Step>(1);
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm<BookUploadFormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: {
            title: '',
            author: '',
            persona: '',
            pdfFile: undefined,
            coverImage: undefined,
        },
    });

    const pdfFile = form.watch('pdfFile');

    const goStep2 = async () => {
        if (!pdfFile) return;
        setStep(2);
    };

    const goStep3 = async () => {
        const valid = await form.trigger(['title', 'author']);
        if (!valid) return;
        setStep(3);
    };

    const onSubmit = async (data: BookUploadFormValues) => {
        if(!userId) {
           return toast.error("Please login to upload books");
        }

        setIsSubmitting(true);

        // PostHog -> Track Book Uploads...

        try {
            const existsCheck = await checkBookExists(data.title);

            if(existsCheck.exists && existsCheck.book) {
                toast.info("Book with same title already exists.");
                form.reset()
                router.push(`/books/${existsCheck.book.slug}`)
                return;
            }

            const fileTitle = data.title.replace(/\s+/g, '-').toLowerCase();
            const pdfFile = data.pdfFile;

            const parsedPDF = await parsePDFFile(pdfFile);

            if(parsedPDF.content.length === 0) {
                toast.error("Failed to parse PDF. Please try again with a different file.");
                return;
            }

            const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                contentType: 'application/pdf'
            });

            let coverUrl: string;

            if(data.coverImage) {
                const coverFile = data.coverImage;
                const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                    contentType: coverFile.type
                });
                coverUrl = uploadedCoverBlob.url;
            } else {
                const response = await fetch(parsedPDF.cover)
                const blob = await response.blob();

                const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                    contentType: 'image/png'
                });
                coverUrl = uploadedCoverBlob.url;
            }

            const book = await createBook({
                userId,
                title: data.title,
                author: data.author,
                persona: data.persona,
                fileURL: uploadedPdfBlob.url,
                fileBlobKey: uploadedPdfBlob.pathname,
                coverURL: coverUrl,
                fileSize: pdfFile.size,
            });

            if(!book.success) {
                toast.error(book.error as string || "Failed to create book");
                if (book.isBillingError) {
                    router.push("/subscriptions");
                }
                return;
            }

            if(book.alreadyExists) {
                toast.info("Book with same title already exists.");
                form.reset()
                router.push(`/books/${book.data.slug}`)
                return;
            }

            const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content);

            if(!segments.success) {
                toast.error("Failed to save book segments");
                throw new Error("Failed to save book segments");
            }

            form.reset();
            router.push('/');
        } catch (error) {
            console.error(error);

            toast.error("Failed to upload book. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;

    return (
        <>
            {isSubmitting && <LoadingOverlay />}

            <div className="book-upload-wrapper">
                <div className="book-upload-steps">
                    {STEPS.map(({ step: s, label }, i) => (
                        <React.Fragment key={s}>
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'book-upload-step-circle',
                                        step === s && 'book-upload-step-circle-current',
                                        step > s && 'book-upload-step-circle-done',
                                        step < s && 'book-upload-step-circle-upcoming'
                                    )}
                                >
                                    {s}
                                </span>
                                <span className={cn('book-upload-step-label', step >= s ? 'text-[var(--foreground)]' : 'book-upload-step-label-upcoming')}>
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={cn('book-upload-step-line', step > s && 'book-upload-step-line-done')} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        {step === 1 && (
                            <div className="flex flex-col gap-8">
                                <FileUploader
                                    control={form.control}
                                    name="pdfFile"
                                    label="Book PDF File"
                                    acceptTypes={ACCEPTED_PDF_TYPES}
                                    icon={Upload}
                                    placeholder="Click to upload PDF"
                                    hint="PDF file (max 50MB)"
                                    disabled={isSubmitting}
                                />

                                <FileUploader
                                    control={form.control}
                                    name="coverImage"
                                    label="Cover Image (Optional)"
                                    acceptTypes={ACCEPTED_IMAGE_TYPES}
                                    icon={ImageIcon}
                                    placeholder="Click to upload cover image"
                                    hint="Leave empty to auto-generate from PDF"
                                    disabled={isSubmitting}
                                />

                                <button
                                    type="button"
                                    onClick={goStep2}
                                    disabled={!pdfFile || isSubmitting}
                                    className={cn('book-upload-btn-primary mt-2', (!pdfFile || isSubmitting) && 'book-upload-btn-primary-disabled')}
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="book-upload-label">Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="book-upload-input"
                                                    placeholder="ex: Rich Dad Poor Dad"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="book-upload-label">Author Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="book-upload-input"
                                                    placeholder="ex: Robert Kiyosaki"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3.5 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="book-upload-btn-secondary flex-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goStep3}
                                        disabled={isSubmitting}
                                        className="book-upload-btn-primary flex-[2]"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="persona"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <VoiceSelector
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3.5 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="book-upload-btn-secondary flex-1"
                                    >
                                        Back
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="book-upload-btn-primary flex-[2]">
                                        Begin Synthesis
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </>
    );
};

export default UploadForm;
