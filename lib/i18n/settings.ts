import en from "./locales/en.json";
import de from "./locales/de.json";

// Legacy localStorage key (kept so existing visitors keep their choice) plus the
// cookie the server reads to render pages in the right language on first paint.
export const LANGUAGE_STORAGE_KEY = "tometalk-language";
export const LANGUAGE_COOKIE_KEY = "tometalk-language";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const SUPPORTED_LANGUAGES = ["en", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const resources = {
    en: { translation: en },
    de: { translation: de },
} as const;

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
    return typeof value === "string" && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

export function normalizeLanguage(value: unknown): SupportedLanguage {
    return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}
