'use client';

import {Mic, MicOff} from "lucide-react";
import {useVapi} from "@/hooks/useVapi";
import {IBook} from "@/types";
import Image from "next/image";
import Transcript from "@/components/Transcript";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {formatDuration} from "@/lib/utils";

import {useRouter} from "next/navigation";
import {useEffect} from "react";

const VapiControls = ({ book }: { book: IBook }) => {
    const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, limitError, isBillingError, maxDurationSeconds } = useVapi(book)
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        if (limitError) {
            toast.error(limitError);
            if (!isBillingError) {
                router.push("/");
            }
            clearError();
        }
    }, [isBillingError, limitError, router, clearError]);

    const getStatusDisplay = () => {
        switch (status) {
            case 'connecting': return { label: t('book.status.connecting'), color: 'vapi-status-dot-connecting' };
            case 'starting': return { label: t('book.status.starting'), color: 'vapi-status-dot-starting' };
            case 'listening': return { label: t('book.status.listening'), color: 'vapi-status-dot-listening' };
            case 'thinking': return { label: t('book.status.thinking'), color: 'vapi-status-dot-thinking' };
            case 'speaking': return { label: t('book.status.speaking'), color: 'vapi-status-dot-speaking' };
            default: return { label: t('book.status.ready'), color: 'vapi-status-dot-ready' };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <>
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {/* Header Card */}
                <div className="vapi-header-card">
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || "/images/book-placeholder.png"}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="vapi-cover-image !w-[120px] !h-auto"
                            priority
                        />
                        <div className="vapi-mic-wrapper relative">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting'}
                                aria-label={isActive ? t('book.stopCall') : t('book.startCall')}
                                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                            >
                                {isActive ? (
                                    <Mic className="size-7 text-white" />
                                ) : (
                                    <MicOff className="size-7 text-[#211f1d]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--foreground)] mb-1">
                                {book.title}
                            </h1>
                            <p className="text-[var(--muted-foreground)] font-medium">{t('book.by', { author: book.author })}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="vapi-status-indicator">
                                <span className={`vapi-status-dot ${statusDisplay.color}`} />
                                <span className="vapi-status-text">{statusDisplay.label}</span>
                            </div>

                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">{t('book.voiceLabel', { name: book.persona || "Daniel" })}</span>
                            </div>

                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">
                                    {formatDuration(duration)}/{formatDuration(maxDurationSeconds)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            <div className="vapi-transcript-wrapper">
                <div className="transcript-container min-h-[400px]">
                    <Transcript
                        messages={messages}
                        currentMessage={currentMessage}
                        currentUserMessage={currentUserMessage}
                    />
                </div>
            </div>
            </div>
        </>
    )
}
export default VapiControls
