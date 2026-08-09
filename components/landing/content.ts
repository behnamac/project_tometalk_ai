// Static copy and demo data for the landing page only. Isolated from real
// app data — none of this is fetched or persisted, it exists purely to
// visually demonstrate the product before a user signs in.

export const HERO_CONTENT = {
    eyebrow: "TomeTalk",
    headline: "Talk to your documents.",
    subheadline:
        "Upload a PDF, book, report, or document. Let AI understand it, then ask anything about it.",
    primaryCta: "Start a conversation",
};

export const READING_SCENE_CONTENT = {
    headline: "Your document becomes understandable.",
    subheadline:
        "TomeTalk reads the content, understands the context, and connects information across the entire document.",
};

export const KNOWLEDGE_SCENE_CONTENT = {
    headline: "Not just search. Understanding.",
    subheadline: "Questions are answered using the meaning and context of your own content.",
};

export const KNOWLEDGE_TOPICS = [
    "Methodology",
    "Key findings",
    "Limitations",
    "Related work",
    "Conclusions",
    "Definitions",
] as const;

export const CONVERSATION_SCENE_CONTENT = {
    headline: "Ask. Understand. Explore.",
};

export type MockChatTurn =
    | { role: "user"; text: string }
    | { role: "assistant"; text: string; points?: string[]; citation?: string };

export const MOCK_LANDING_CONVERSATION: MockChatTurn[] = [
    { role: "user", text: "What are the main conclusions of this document?" },
    {
        role: "assistant",
        text: "The document identifies three main conclusions:",
        points: [
            "The proposed method outperforms the baseline by a wide margin.",
            "Results hold consistently across every tested dataset.",
            "Further work is needed on edge cases with sparse data.",
        ],
        citation: "p. 24, Conclusions",
    },
];

export const USE_CASES = [
    {
        title: "Study",
        description: "Turn books and lecture notes into your personal study assistant.",
        example: "“Summarize chapter 4 in simple terms.”",
    },
    {
        title: "Research",
        description: "Explore long papers without reading every page again.",
        example: "“What methodology did the authors use?”",
    },
    {
        title: "Work",
        description: "Ask questions across reports, documentation, and internal knowledge.",
        example: "“What changed between these two versions?”",
    },
    {
        title: "Understand",
        description: "Break down complicated documents into clear explanations.",
        example: "“Explain this clause like I’m new to it.”",
    },
] as const;

export const CAPABILITIES = [
    {
        title: "Upload anything worth understanding",
        description: "PDFs, books, reports, manuals, research papers, and more.",
    },
    {
        title: "Ask contextual questions",
        description: "Get answers grounded in the exact content you uploaded.",
    },
    {
        title: "Summarize long content",
        description: "From hundreds of pages to one simple conversation.",
    },
    {
        title: "Find specific information",
        description: "Find answers without searching page by page.",
    },
    {
        title: "Explore ideas across a document",
        description: "Follow a thread of reasoning wherever it leads.",
    },
] as const;

export const FINAL_CTA_CONTENT = {
    headline: "Your documents have answers.",
    subheadline: "Start asking.",
    primaryCta: "Talk to your documents",
};

export const APP_ENTRY_ROUTE = "/books/new";
