'use client';

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n";

initI18n();

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage) && stored !== i18n.language) {
            i18n.changeLanguage(stored);
        }
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
