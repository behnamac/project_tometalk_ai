import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';

import mongoClient, { mongoDb } from '@/database/mongo-client';
import { PLANS } from '@/lib/subscription-constants';

function buildAuth() {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

    return betterAuth({
        database: mongodbAdapter(mongoDb, { client: mongoClient }),
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
// this one) during build-time page-data collection — if the Stripe/Mongo
// clients were constructed at module scope, that phase would require
// STRIPE_SECRET_KEY etc. to be set just to build, even for routes that never
// touch billing. The Proxy defers construction until the first `auth.*`
// access, which only happens while handling a real request.
export const auth: Auth = new Proxy({} as Auth, {
    get(_target, prop, receiver) {
        return Reflect.get(getAuthInstance(), prop, receiver);
    },
    has(_target, prop) {
        return Reflect.has(getAuthInstance(), prop);
    },
});
