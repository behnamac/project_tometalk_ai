import prisma from "@/database/prisma";
import { getUserPlan } from "@/lib/subscription.server";
import { PLAN_LIMITS, getCurrentBillingPeriodStart } from "@/lib/subscription-constants";
import { BillingLimitError } from "@/lib/services/book.service";

export interface StartedSession {
    sessionId: string;
    maxDurationMinutes: number;
}

export async function startSessionForUser(userId: string, bookId: string): Promise<StartedSession> {
    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const billingPeriodStart = getCurrentBillingPeriodStart();

    const sessionCount = await prisma.voiceSession.count({ where: { userId, billingPeriodStart } });

    if (sessionCount >= limits.maxSessionsPerMonth) {
        throw new BillingLimitError(
            `You have reached the monthly session limit for your ${plan} plan (${limits.maxSessionsPerMonth}). Please upgrade for more sessions.`,
        );
    }

    const session = await prisma.voiceSession.create({
        data: {
            userId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0,
        },
    });

    return {
        sessionId: session.id,
        maxDurationMinutes: limits.maxDurationPerSession,
    };
}

export async function endSessionForUser(sessionId: string, userId: string, durationSeconds: number): Promise<void> {
    const existing = await prisma.voiceSession.findUnique({ where: { id: sessionId } });

    if (!existing || existing.userId !== userId) {
        throw new Error("Voice session not found.");
    }

    await prisma.voiceSession.update({
        where: { id: sessionId },
        data: { endedAt: new Date(), durationSeconds },
    });
}
