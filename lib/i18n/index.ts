"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, normalizeLanguage, resources, type SupportedLanguage } from "./settings";

let initialized = false;

export function initI18n(language: SupportedLanguage = DEFAULT_LANGUAGE) {
    if (initialized) {
        const target = normalizeLanguage(language);
        if (i18n.language !== target) i18n.changeLanguage(target);
        return i18n;
    }

    initialized = true;

    i18n.use(initReactI18next).init({
        resources,
        lng: normalizeLanguage(language),
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });

    return i18n;
}

export {
    LANGUAGE_STORAGE_KEY,
    LANGUAGE_COOKIE_KEY,
    LANGUAGE_COOKIE_MAX_AGE,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    normalizeLanguage,
    isSupportedLanguage,
} from "./settings";
export type { SupportedLanguage } from "./settings";

export default i18n;
