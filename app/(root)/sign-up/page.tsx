'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { SignUpSchema } from '@/lib/zod';
import { SignUpFormValues } from '@/types';
import { authClient } from '@/lib/auth-client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUpPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: { name: '', email: '', password: '' },
    });

    const onSubmit = async (data: SignUpFormValues) => {
        setIsSubmitting(true);

        await authClient.signUp.email(data, {
            onSuccess: () => {
                router.push('/library');
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || 'Failed to create account');
            },
        });

        setIsSubmitting(false);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-shadow w-full max-w-md p-8">
                <h1 className="page-title">Create your account</h1>
                <p className="page-description">Start transforming your books into conversations.</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="form-input"
                                            placeholder="Your name"
                                            autoComplete="name"
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
                                            placeholder="At least 8 characters"
                                            autoComplete="new-password"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="form-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                    Already have an account?{' '}
                    <Link href="/sign-in" className="font-medium text-[#212a3b] hover:text-[#3d485e]">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
