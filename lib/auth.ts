import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';

import prisma from '@/database/prisma';
import { PLANS } from '@/lib/subscription-constants';

function buildAuth() {
    // The Stripe SDK itself validates its apiKey argument eagerly and throws
    // if it's missing — a placeholder keeps construction (and therefore the
    // whole auth setup, including unrelated features like email/password
    // sign-in) from crashing when Stripe billing isn't configured yet. Real
    // Stripe calls made with this placeholder fail normally against Stripe's
    // API instead of crashing at startup.
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_not_configured');

    return betterAuth({
        database: prismaAdapter(prisma, { provider: 'postgresql' }),
        emailAndPassword: {
            enabled: true,
        },
        plugins: [
            stripe({
                stripeClient,
                stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
                createCustomerOnSignUp: true,
                subscription: {
                    enabled: true,
                    plans: [
                        { name: PLANS.STANDARD, priceId: process.env.STRIPE_STANDARD_PRICE_ID! },
                        { name: PLANS.PRO, priceId: process.env.STRIPE_PRO_PRICE_ID! },
                    ],
                },
            }),
            // Must be the last plugin so server actions can set cookies automatically.
            nextCookies(),
        ],
    });
}

type Auth = ReturnType<typeof buildAuth>;

let authInstance: Auth | undefined;

function getAuthInstance(): Auth {
    if (!authInstance) authInstance = buildAuth();
    return authInstance;
}

// Built lazily, on first real access, rather than eagerly at module import
// time. Next.js imports every route module (transitively, via files like
// this one) during build-time page-data collection — if the Stripe client
// were constructed at module scope, that phase would require
// STRIPE_SECRET_KEY etc. to be set just to build, even for routes that never
// touch billing. The Proxy defers construction until the first `auth.*`
// access, which only happens while handling a real request.
export const auth: Auth = new Proxy({} as Auth, {
    // Deliberately use the real instance as the receiver (not the default
    // Proxy receiver) — otherwise any getter/method on the instance that
    // reads `this` internally (e.g. to reach private class fields) would run
    // with `this` bound to this Proxy instead of the real object, and throw.
    get(_target, prop) {
        const instance = getAuthInstance();
        return Reflect.get(instance, prop, instance);
    },
    has(_target, prop) {
        return Reflect.has(getAuthInstance(), prop);
    },
});
