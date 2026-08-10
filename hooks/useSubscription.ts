'use client';

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { PLANS, PLAN_LIMITS, PlanType } from "@/lib/subscription-constants";

const resolvePlan = (subscriptions?: { status: string; plan: string }[]): PlanType => {
    const active = subscriptions?.find((sub) => sub.status === 'active' || sub.status === 'trialing');

    if (active?.plan === PLANS.PRO) return PLANS.PRO;
    if (active?.plan === PLANS.STANDARD) return PLANS.STANDARD;

    return PLANS.FREE;
};

export const useSubscription = () => {
    const { data: session, isPending: isSessionPending } = authClient.useSession();
    const [fetchedPlan, setFetchedPlan] = useState<PlanType | null>(null);

    useEffect(() => {
        if (isSessionPending || !session?.user) return;

        let cancelled = false;

        authClient.subscription.list()
            .then(({ data }) => {
                if (!cancelled) setFetchedPlan(resolvePlan(data ?? undefined));
            })
            .catch(() => {
                if (!cancelled) setFetchedPlan(PLANS.FREE);
            });

        return () => {
            cancelled = true;
        };
    }, [isSessionPending, session?.user]);

    // No signed-in user → free plan with nothing to wait on; otherwise wait
    // for the subscription fetch to resolve at least once.
    const plan = !session?.user ? PLANS.FREE : fetchedPlan ?? PLANS.FREE;
    const isLoaded = !isSessionPending && (!session?.user || fetchedPlan !== null);

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded,
    };
};
