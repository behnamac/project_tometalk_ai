import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';

import mongoClient, { mongoDb } from '@/database/mongo-client';
import { PLANS } from '@/lib/subscription-constants';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const auth = betterAuth({
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
