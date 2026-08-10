import { connectToDatabase } from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import { getUserPlan } from "@/lib/subscription.server";
import { PLAN_LIMITS, getCurrentBillingPeriodStart } from "@/lib/subscription-constants";
import { BillingLimitError } from "@/lib/services/book.service";

export interface StartedSession {
    sessionId: string;
    maxDurationMinutes: number;
}

export async function startSessionForUser(userId: string, bookId: string): Promise<StartedSession> {
    await connectToDatabase();

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];
    const billingPeriodStart = getCurrentBillingPeriodStart();

    const sessionCount = await VoiceSession.countDocuments({ userId, billingPeriodStart });

    if (sessionCount >= limits.maxSessionsPerMonth) {
        throw new BillingLimitError(
            `You have reached the monthly session limit for your ${plan} plan (${limits.maxSessionsPerMonth}). Please upgrade for more sessions.`,
        );
    }

    const session = await VoiceSession.create({
        userId,
        bookId,
        startedAt: new Date(),
        billingPeriodStart,
        durationSeconds: 0,
    });

    return {
        sessionId: session._id.toString(),
        maxDurationMinutes: limits.maxDurationPerSession,
    };
}

export async function endSessionForUser(sessionId: string, userId: string, durationSeconds: number): Promise<void> {
    await connectToDatabase();

    const existing = await VoiceSession.findById(sessionId).lean();

    if (!existing || existing.userId !== userId) {
        throw new Error("Voice session not found.");
    }

    await VoiceSession.findByIdAndUpdate(sessionId, {
        endedAt: new Date(),
        durationSeconds,
    });
}
