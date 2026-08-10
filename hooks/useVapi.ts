'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';

import { useSubscription } from '@/hooks/useSubscription';
import { useCallTimer } from '@/hooks/useCallTimer';
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from '@/lib/constants/voice';
import { getVoice } from '@/lib/utils';
import { getVapi } from '@/lib/vapi-client';
import { mapVapiError } from '@/lib/vapi-errors';
import { IBook, Messages } from '@/types';
import { startVoiceSession, endVoiceSession } from '@/lib/actions/session.actions';

export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';

export function useVapi(book: IBook) {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;
    const { limits } = useSubscription();

    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [limitError, setLimitError] = useState<string | null>(null);
    const [isBillingError, setIsBillingError] = useState(false);

    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef(false);

    const maxDurationSeconds = limits?.maxDurationPerSession ? limits.maxDurationPerSession * 60 : 15 * 60;
    const voice = book.persona || DEFAULT_VOICE;

    const endSessionTracking = useCallback((durationSeconds: number) => {
        if (!sessionIdRef.current) return;
        endVoiceSession(sessionIdRef.current, durationSeconds).catch((err) =>
            console.error('Failed to end voice session:', err),
        );
        sessionIdRef.current = null;
    }, []);

    const timer = useCallTimer({
        maxDurationSeconds,
        onLimitReached: () => {
            getVapi().stop();
            setLimitError(
                `Session time limit (${Math.floor(maxDurationSeconds / 60)} minutes) reached. Upgrade your plan for longer sessions.`,
            );
        },
    });

    // Set up Vapi event listeners
    useEffect(() => {
        const handlers = {
            'call-start': () => {
                isStoppingRef.current = false;
                setStatus('starting'); // AI speaks first, wait for it
                setCurrentMessage('');
                setCurrentUserMessage('');
                timer.start();
            },

            'call-end': () => {
                // Don't reset isStoppingRef here - delayed events may still fire
                setStatus('idle');
                setCurrentMessage('');
                setCurrentUserMessage('');
                timer.stop();
                endSessionTracking(timer.durationRef.current);
            },

            'speech-start': () => {
                if (!isStoppingRef.current) {
                    setStatus('speaking');
                }
            },
            'speech-end': () => {
                if (!isStoppingRef.current) {
                    // After AI finishes speaking, user can talk
                    setStatus('listening');
                }
            },

            message: (message: {
                type: string;
                role: string;
                transcriptType: string;
                transcript: string;
            }) => {
                if (message.type !== 'transcript') return;

                // User finished speaking → AI is thinking
                if (message.role === 'user' && message.transcriptType === 'final') {
                    if (!isStoppingRef.current) {
                        setStatus('thinking');
                    }
                    setCurrentUserMessage('');
                }

                // Partial user transcript → show real-time typing
                if (message.role === 'user' && message.transcriptType === 'partial') {
                    setCurrentUserMessage(message.transcript);
                    return;
                }

                // Partial AI transcript → show word-by-word
                if (message.role === 'assistant' && message.transcriptType === 'partial') {
                    setCurrentMessage(message.transcript);
                    return;
                }

                // Final transcript → add to messages
                if (message.transcriptType === 'final') {
                    if (message.role === 'assistant') setCurrentMessage('');
                    if (message.role === 'user') setCurrentUserMessage('');

                    setMessages((prev) => {
                        const isDupe = prev.some(
                            (m) => m.role === message.role && m.content === message.transcript,
                        );
                        return isDupe ? prev : [...prev, { role: message.role, content: message.transcript }];
                    });
                }
            },

            error: (error: Error) => {
                console.error('Vapi error:', error);
                // Don't reset isStoppingRef here - delayed events may still fire
                setStatus('idle');
                setCurrentMessage('');
                setCurrentUserMessage('');
                timer.stop();
                endSessionTracking(timer.durationRef.current);
                setLimitError(mapVapiError(error));
            },
        };

        // Register all handlers
        Object.entries(handlers).forEach(([event, handler]) => {
            getVapi().on(event as keyof typeof handlers, handler as () => void);
        });

        return () => {
            // End active session on unmount
            if (sessionIdRef.current) {
                getVapi().stop();
                endSessionTracking(timer.durationRef.current);
            }
            // Cleanup handlers
            Object.entries(handlers).forEach(([event, handler]) => {
                getVapi().off(event as keyof typeof handlers, handler as () => void);
            });
            timer.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const start = useCallback(async () => {
        if (!userId) {
            setLimitError('Please sign in to start a voice session.');
            return;
        }

        setLimitError(null);
        setIsBillingError(false);
        setStatus('connecting');

        try {
            // Check session limits and create session record
            const result = await startVoiceSession(book._id);

            if (!result.success) {
                setLimitError(result.error || 'Session limit reached. Please upgrade your plan.');
                setIsBillingError(!!result.isBillingError);
                setStatus('idle');
                return;
            }

            sessionIdRef.current = result.sessionId || null;
            // Note: Server-returned maxDurationMinutes is informational only
            // The actual limit is enforced by the maxDurationSeconds passed to useCallTimer

            const firstMessage = `Hey, good to meet you. Quick question before we dive in - have you actually read ${book.title} yet, or are we starting fresh?`;

            await getVapi().start(ASSISTANT_ID, {
                firstMessage,
                variableValues: {
                    title: book.title,
                    author: book.author,
                    bookId: book._id,
                },
                voice: {
                    provider: '11labs' as const,
                    voiceId: getVoice(voice).id,
                    model: 'eleven_turbo_v2_5' as const,
                    stability: VOICE_SETTINGS.stability,
                    similarityBoost: VOICE_SETTINGS.similarityBoost,
                    style: VOICE_SETTINGS.style,
                    useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
                },
            });
        } catch (err) {
            console.error('Failed to start call:', err);
            setStatus('idle');
            setLimitError('Failed to start voice session. Please try again.');
        }
    }, [book._id, book.title, book.author, voice, userId]);

    const stop = useCallback(() => {
        isStoppingRef.current = true;
        getVapi().stop();
    }, []);

    const clearError = useCallback(() => {
        setLimitError(null);
        setIsBillingError(false);
    }, []);

    const isActive =
        status === 'starting' ||
        status === 'listening' ||
        status === 'thinking' ||
        status === 'speaking';

    return {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration: timer.duration,
        start,
        stop,
        limitError,
        isBillingError,
        maxDurationSeconds,
        clearError,
    };
}
