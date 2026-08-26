"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import {
    LANGUAGE_COOKIE_KEY,
    LANGUAGE_COOKIE_MAX_AGE,
    LANGUAGE_STORAGE_KEY,
    normalizeLanguage,
    type SupportedLanguage,
} from "./settings";

/**
 * Returns the active language plus a setter that keeps the client i18n instance,
 * localStorage, and the SSR cookie in sync, then refreshes Server Components so
 * server-rendered copy switches too.
 */
export function useLanguage() {
    const { i18n } = useTranslation();
    const router = useRouter();

    const language = normalizeLanguage(i18n.language);

    const setLanguage = useCallback(
        (next: string) => {
            const value = normalizeLanguage(next);
            if (value === normalizeLanguage(i18n.language)) return;

            i18n.changeLanguage(value);

            try {
                window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
            } catch {
                // ignore storage failures (private mode, disabled storage)
            }

            document.cookie = `${LANGUAGE_COOKIE_KEY}=${value}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;

            router.refresh();
        },
        [i18n, router]
    );

    return { language, setLanguage };
}

export type { SupportedLanguage };
