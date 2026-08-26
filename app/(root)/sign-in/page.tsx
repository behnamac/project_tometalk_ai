'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

import { SignInSchema } from '@/lib/zod';
import { SignInFormValues } from '@/types';
import { authClient } from '@/lib/auth-client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const REASON_SUBTITLE_KEYS: Record<string, string> = {
    upload: 'signIn.subtitleUpload',
};

// Only allow redirecting back to a same-site relative path, never an absolute
// URL, to avoid an open redirect via the `redirect` query param.
function getSafeRedirect(redirect: string | null): string {
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.startsWith('/\\')) {
        return redirect;
    }
    return '/library';
}

const SignInForm = () => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const reason = searchParams.get('reason');
    const subtitleKey = (reason && REASON_SUBTITLE_KEYS[reason]) || 'signIn.subtitleDefault';
    const subtitle = t(subtitleKey);
    const redirectTarget = getSafeRedirect(searchParams.get('redirect'));

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(SignInSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: SignInFormValues) => {
        setIsSubmitting(true);

        await authClient.signIn.email(data, {
            onSuccess: () => {
                router.push(redirectTarget);
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || t('signIn.failed'));
            },
        });

        setIsSubmitting(false);
    };

    return (
        <div className="login-dark flex min-h-screen">
            <div className="login-visual-panel hidden md:flex">
                <div className="login-glow-1" />
                <div className="login-glow-2" />
                <div className="login-particle login-particle-1" />
                <div className="login-particle login-particle-2" />
                <div className="login-particle login-particle-3" />
                <div className="login-particle login-particle-4" />

                <div className="login-book-wrap">
                    <div className="login-book">
                        <div className="login-book-cover" />
                        <div className="login-book-spine" />
                        <div className="login-book-line-1" />
                        <div className="login-book-line-2" />
                        <div className="login-book-line-3" />
                    </div>
                </div>
            </div>

            <div className="login-form-panel">
                <div className="login-card">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={32} height={32} className="login-logo" />
                    <h1 className="login-title">{t('signIn.title')}</h1>
                    <p className="login-subtitle">{subtitle}</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="login-form-fields">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="login-label">{t('signIn.emailLabel')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="login-input"
                                                type="email"
                                                placeholder={t('signIn.emailPlaceholder')}
                                                autoComplete="email"
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="login-label">{t('signIn.passwordLabel')}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    className="login-input !pr-11"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    autoComplete="current-password"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    disabled={isSubmitting}
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50"
                                                    aria-label={showPassword ? t('signIn.hidePassword') : t('signIn.showPassword')}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="login-btn-primary" disabled={isSubmitting}>
                                <span className="login-btn-sweep" />
                                <span className="login-btn-text">{isSubmitting ? t('signIn.submitting') : t('signIn.submit')}</span>
                            </Button>
                        </form>
                    </Form>

                    <p className="login-footer-text">
                        {t('signIn.footer')}{' '}
                        <Link href="/sign-up" className="login-link">
                            {t('signIn.signUpLink')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const SignInPage = () => (
    <Suspense fallback={null}>
        <SignInForm />
    </Suspense>
);

export default SignInPage;
