'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { SignInSchema } from '@/lib/zod';
import { SignInFormValues } from '@/types';
import { authClient } from '@/lib/auth-client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(SignInSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: SignInFormValues) => {
        setIsSubmitting(true);

        await authClient.signIn.email(data, {
            onSuccess: () => {
                router.push('/library');
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || 'Failed to sign in');
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
                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-subtitle">Sign in to continue your book conversations.</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="login-form-fields">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="login-label">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="login-input"
                                                type="email"
                                                placeholder="you@example.com"
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
                                        <FormLabel className="login-label">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="login-input"
                                                type="password"
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="login-btn-primary" disabled={isSubmitting}>
                                <span className="login-btn-sweep" />
                                <span className="login-btn-text">{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                            </Button>
                        </form>
                    </Form>

                    <p className="login-footer-text">
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" className="login-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
