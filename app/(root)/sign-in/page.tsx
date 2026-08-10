'use client';

import { useState } from 'react';
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
        <div className="auth-wrapper">
            <div className="auth-shadow w-full max-w-md p-8">
                <h1 className="page-title">Welcome back</h1>
                <p className="page-description">Sign in to continue your book conversations.</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="form-input"
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
                                    <FormLabel className="form-label">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="form-input"
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

                        <Button type="submit" className="form-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/sign-up" className="font-medium text-[#212a3b] hover:text-[#3d485e]">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
