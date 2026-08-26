import { cookies } from "next/headers";
import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import {
    DEFAULT_LANGUAGE,
    LANGUAGE_COOKIE_KEY,
    normalizeLanguage,
    resources,
    type SupportedLanguage,
} from "./settings";

/** Language for the current request, taken from the cookie the switcher writes. */
export async function getRequestLanguage(): Promise<SupportedLanguage> {
    const store = await cookies();
    return normalizeLanguage(store.get(LANGUAGE_COOKIE_KEY)?.value);
}

async function createServerInstance(language: SupportedLanguage): Promise<I18nInstance> {
    const instance = createInstance();
    await instance.use(initReactI18next).init({
        resources,
        lng: language,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: { escapeValue: false },
    });
    return instance;
}

/**
 * Server-side translator for the current request. Use in Server Components:
 *   const { t } = await getServerTranslation();
 */
export async function getServerTranslation() {
    const language = await getRequestLanguage();
    const instance = await createServerInstance(language);
    return { t: instance.getFixedT(language), i18n: instance, language };
}
