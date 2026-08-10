import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { PLANS, PLAN_LIMITS, PlanType } from "@/lib/subscription-constants";

export const getUserPlan = async (): Promise<PlanType> => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) return PLANS.FREE;

    const subscriptions = await auth.api.listActiveSubscriptions({ headers: await headers() });
    const active = subscriptions?.find((sub) => sub.status === "active" || sub.status === "trialing");

    if (active?.plan === PLANS.PRO) return PLANS.PRO;
    if (active?.plan === PLANS.STANDARD) return PLANS.STANDARD;

    return PLANS.FREE;
}

export const getPlanLimits = async () => {
    const plan = await getUserPlan();
    return PLAN_LIMITS[plan];
}
