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
    const [plan, setPlan] = useState<PlanType>(PLANS.FREE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (isSessionPending) return;

        if (!session?.user) {
            setPlan(PLANS.FREE);
            setIsLoaded(true);
            return;
        }

        let cancelled = false;

        authClient.subscription.list()
            .then(({ data }) => {
                if (!cancelled) {
                    setPlan(resolvePlan(data ?? undefined));
                    setIsLoaded(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setPlan(PLANS.FREE);
                    setIsLoaded(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isSessionPending, session?.user]);

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded,
    };
};
