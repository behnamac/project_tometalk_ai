'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { I18nextProvider } from "react-i18next";

import i18n, {
    initI18n,
    LANGUAGE_COOKIE_KEY,
    LANGUAGE_COOKIE_MAX_AGE,
    LANGUAGE_STORAGE_KEY,
    normalizeLanguage,
    isSupportedLanguage,
    type SupportedLanguage,
} from "@/lib/i18n";

const I18nProvider = ({
    language,
    children,
}: {
    language: SupportedLanguage;
    children: React.ReactNode;
}) => {
    // Initialise synchronously with the server-resolved language so the first
    // client render matches the server markup (no hydration mismatch).
    const [instance] = useState(() => initI18n(language));
    const router = useRouter();
    const migrated = useRef(false);

    useEffect(() => {
        if (i18n.language !== language) i18n.changeLanguage(language);
    }, [language]);

    // One-time migration: visitors who picked a language before the cookie
    // existed only have it in localStorage. Promote it to the cookie so the
    // server can honour it, then refresh.
    useEffect(() => {
        if (migrated.current) return;
        migrated.current = true;

        const hasCookie = document.cookie
            .split("; ")
            .some((entry) => entry.startsWith(`${LANGUAGE_COOKIE_KEY}=`));
        if (hasCookie) return;

        let stored: string | null = null;
        try {
            stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        } catch {
            stored = null;
        }
        if (!isSupportedLanguage(stored)) return;

        document.cookie = `${LANGUAGE_COOKIE_KEY}=${stored}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;

        if (normalizeLanguage(stored) !== language) {
            i18n.changeLanguage(stored);
            router.refresh();
        }
    }, [language, router]);

    return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};

export default I18nProvider;
