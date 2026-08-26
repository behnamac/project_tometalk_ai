'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Upload, ImageIcon } from 'lucide-react';
import { UploadSchema } from '@/lib/zod';
import { BookUploadFormValues } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants/upload';
import { cn } from '@/lib/utils';
import FileUploader from './FileUploader';
import VoiceSelector from './VoiceSelector';
import LoadingOverlay from './LoadingOverlay';
import { useBookUpload } from '@/hooks/useBookUpload';
import { useIsMounted } from '@/hooks/useIsMounted';

type Step = 1 | 2 | 3;

const STEPS: { step: Step; labelKey: string }[] = [
    { step: 1, labelKey: 'upload.steps.upload' },
    { step: 2, labelKey: 'upload.steps.details' },
    { step: 3, labelKey: 'upload.steps.voice' },
];

const UploadForm = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>(1);
    const isMounted = useIsMounted();
    const { submit, isSubmitting } = useBookUpload();

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
        const shouldReset = await submit(data);
        if (shouldReset) form.reset();
    };

    if (!isMounted) return null;

    return (
        <>
            {isSubmitting && <LoadingOverlay />}

            <div className="book-upload-wrapper">
                <div className="book-upload-steps">
                    {STEPS.map(({ step: s, labelKey }, i) => (
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
                                    {t(labelKey)}
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
                                    label={t('upload.pdfLabel')}
                                    acceptTypes={ACCEPTED_PDF_TYPES}
                                    icon={Upload}
                                    placeholder={t('upload.pdfPlaceholder')}
                                    hint={t('upload.pdfHint')}
                                    disabled={isSubmitting}
                                />

                                <FileUploader
                                    control={form.control}
                                    name="coverImage"
                                    label={t('upload.coverLabel')}
                                    acceptTypes={ACCEPTED_IMAGE_TYPES}
                                    icon={ImageIcon}
                                    placeholder={t('upload.coverPlaceholder')}
                                    hint={t('upload.coverHint')}
                                    disabled={isSubmitting}
                                />

                                <button
                                    type="button"
                                    onClick={goStep2}
                                    disabled={!pdfFile || isSubmitting}
                                    className={cn('book-upload-btn-primary mt-2', (!pdfFile || isSubmitting) && 'book-upload-btn-primary-disabled')}
                                >
                                    {t('upload.continue')}
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
                                            <FormLabel className="book-upload-label">{t('upload.titleLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="book-upload-input"
                                                    placeholder={t('upload.titlePlaceholder')}
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
                                            <FormLabel className="book-upload-label">{t('upload.authorLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="book-upload-input"
                                                    placeholder={t('upload.authorPlaceholder')}
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
                                        {t('upload.back')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goStep3}
                                        disabled={isSubmitting}
                                        className="book-upload-btn-primary flex-[2]"
                                    >
                                        {t('upload.continue')}
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
                                        {t('upload.back')}
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="book-upload-btn-primary flex-[2]">
                                        {t('upload.beginSynthesis')}
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
