'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { EndSessionResult, StartSessionResult } from "@/types";
import { auth } from "@/lib/auth";
import * as sessionService from "@/lib/services/session.service";
import { BillingLimitError } from "@/lib/services/book.service";

export const startVoiceSession = async (bookId: string): Promise<StartSessionResult> => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'You must be signed in to start a voice session.' };
        }

        const started = await sessionService.startSessionForUser(userId, bookId);

        return {
            success: true,
            sessionId: started.sessionId,
            maxDurationMinutes: started.maxDurationMinutes,
        };
    } catch (e) {
        if (e instanceof BillingLimitError) {
            revalidatePath("/");
            return { success: false, error: e.message, isBillingError: true };
        }
        console.error('Error starting voice session', e);
        return { success: false, error: 'Failed to start voice session. Please try again later.' };
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, error: 'You must be signed in to end a voice session.' };
        }

        await sessionService.endSessionForUser(sessionId, userId, durationSeconds);

        return { success: true };
    } catch (e) {
        console.error('Error ending voice session', e);
        return { success: false, error: 'Failed to end voice session. Please try again later.' };
    }
}
