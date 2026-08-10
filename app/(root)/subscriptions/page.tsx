'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { useSubscription } from '@/hooks/useSubscription';
import { PLANS, PLAN_LIMITS, PlanType } from '@/lib/subscription-constants';
import { Button } from '@/components/ui/button';

const PLAN_COPY: Record<PlanType, { title: string; price: string; description: string }> = {
    [PLANS.FREE]: {
        title: 'Free',
        price: '$0',
        description: 'Try out TomeTalk with a single book.',
    },
    [PLANS.STANDARD]: {
        title: 'Standard',
        price: '$9/mo',
        description: 'For regular readers who want more room to explore.',
    },
    [PLANS.PRO]: {
        title: 'Pro',
        price: '$29/mo',
        description: 'Unlimited conversations for power readers.',
    },
};

const PLAN_ORDER: PlanType[] = [PLANS.FREE, PLANS.STANDARD, PLANS.PRO];

const formatLimit = (value: number) => (value === Infinity ? 'Unlimited' : value);

const planFeatures = (plan: PlanType): string[] => {
    const limits = PLAN_LIMITS[plan];

    return [
        `${formatLimit(limits.maxBooks)} book${limits.maxBooks === 1 ? '' : 's'}`,
        `${formatLimit(limits.maxSessionsPerMonth)} voice sessions / month`,
        `${limits.maxDurationPerSession} min per session`,
        limits.hasSessionHistory ? 'Session history' : 'No session history',
    ];
};

export default function SubscriptionsPage() {
    const { plan: currentPlan, isLoaded } = useSubscription();
    const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

    const handleUpgrade = async (plan: PlanType) => {
        setLoadingPlan(plan);

        try {
            await authClient.subscription.upgrade({
                plan,
                successUrl: '/subscriptions',
                cancelUrl: '/subscriptions',
            });
        } catch {
            toast.error('Failed to start checkout. Please try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="container wrapper py-10">
            <div className="flex flex-col items-center text-center mb-10">
                <h1 className="text-4xl font-bold font-serif mb-4">Choose Your Plan</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Upgrade to unlock more books, longer sessions, and advanced features.
                </p>
            </div>

            <div className="pricing-grid">
                {PLAN_ORDER.map((plan) => {
                    const isCurrent = isLoaded && currentPlan === plan;
                    const isFeatured = plan === PLANS.PRO;

                    return (
                        <div key={plan} className={isFeatured ? 'pricing-card pricing-card-featured' : 'pricing-card'}>
                            {isFeatured && <span className="pricing-badge">Most Popular</span>}

                            <h2 className="pricing-plan-name">{PLAN_COPY[plan].title}</h2>
                            <p className="pricing-plan-price">{PLAN_COPY[plan].price}</p>
                            <p className="pricing-plan-description">{PLAN_COPY[plan].description}</p>

                            <ul className="pricing-feature-list">
                                {planFeatures(plan).map((feature) => (
                                    <li key={feature} className="pricing-feature">
                                        <Check className="size-4 shrink-0 mt-0.5 text-[var(--color-brand)]" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                {plan === PLANS.FREE ? (
                                    <Button className="form-btn" disabled>
                                        {isCurrent ? 'Your Current Plan' : 'Included'}
                                    </Button>
                                ) : (
                                    <Button
                                        className="form-btn"
                                        disabled={isCurrent || loadingPlan === plan}
                                        onClick={() => handleUpgrade(plan)}
                                    >
                                        {isCurrent
                                            ? 'Your Current Plan'
                                            : loadingPlan === plan
                                                ? 'Redirecting...'
                                                : `Upgrade to ${PLAN_COPY[plan].title}`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
