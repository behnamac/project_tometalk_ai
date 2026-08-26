// Structure-only data for the landing page. All user-facing copy lives in the
// i18n locale files (landing.* keys) so it follows the selected language.
// Nothing here is fetched or persisted — it exists purely to drive the
// pre-sign-in marketing scenes.

export const KNOWLEDGE_TOPIC_KEYS = [
    "methodology",
    "keyFindings",
    "limitations",
    "relatedWork",
    "conclusions",
    "definitions",
] as const;

export const CONVERSATION_POINT_KEYS = ["one", "two", "three"] as const;

export const USE_CASE_KEYS = ["study", "research", "work", "understand"] as const;

export const CAPABILITY_KEYS = ["upload", "contextual", "summarize", "find", "explore"] as const;

export const APP_ENTRY_ROUTE = "/books/new";
