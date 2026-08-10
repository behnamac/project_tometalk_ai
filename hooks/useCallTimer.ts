'use client';

import { useCallback, useRef, useState } from 'react';
import { useLatestRef } from '@/hooks/useLatestRef';

const TIMER_INTERVAL_MS = 1000;

interface UseCallTimerOptions {
    maxDurationSeconds: number;
    onLimitReached: () => void;
}

// Tracks elapsed call duration on a 1s interval and fires onLimitReached once
// maxDurationSeconds is hit. durationRef exposes the latest value for reads
// from long-lived closures (e.g. an event handler bound once on mount).
export function useCallTimer({ maxDurationSeconds, onLimitReached }: UseCallTimerOptions) {
    const [duration, setDuration] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const durationRef = useLatestRef(duration);
    const maxDurationRef = useLatestRef(maxDurationSeconds);
    const onLimitReachedRef = useLatestRef(onLimitReached);

    const start = useCallback(() => {
        startTimeRef.current = Date.now();
        setDuration(0);

        timerRef.current = setInterval(() => {
            if (!startTimeRef.current) return;

            const newDuration = Math.floor((Date.now() - startTimeRef.current) / TIMER_INTERVAL_MS);
            setDuration(newDuration);

            if (newDuration >= maxDurationRef.current) {
                onLimitReachedRef.current();
            }
        }, TIMER_INTERVAL_MS);
    }, [maxDurationRef, onLimitReachedRef]);

    const stop = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        startTimeRef.current = null;
    }, []);

    return { duration, durationRef, start, stop };
}
