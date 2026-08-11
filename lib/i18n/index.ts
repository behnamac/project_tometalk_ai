import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import de from "./locales/de.json";

export const LANGUAGE_STORAGE_KEY = "tometalk-language";
export const SUPPORTED_LANGUAGES = ["en", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

let initialized = false;

export function initI18n() {
    if (initialized) return i18n;
    initialized = true;

    i18n.use(initReactI18next).init({
        resources: {
            en: { translation: en },
            de: { translation: de },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

    return i18n;
}

export default i18n;
