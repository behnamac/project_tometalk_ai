"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { APP_ENTRY_ROUTE } from "./content";

const SOLID_THRESHOLD = 80;

const LandingNavigation = () => {
    const [isSolid, setIsSolid] = useState(false);
    const { scrollY } = useScroll();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsSolid(latest > SOLID_THRESHOLD);
    });

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
                isSolid ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
            )}
        >
            <div className="wrapper flex items-center justify-between py-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={36} height={22} />
                    <span className="font-serif text-lg font-semibold text-foreground">TomeTalk</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-1 rounded-full border border-border p-0.5"
                        role="group"
                        aria-label={t("language.label")}
                    >
                        {SUPPORTED_LANGUAGES.map((lng) => (
                            <button
                                key={lng}
                                type="button"
                                onClick={() => setLanguage(lng)}
                                className={cn(
                                    "rounded-full px-3 py-1 text-xs font-medium uppercase transition-colors",
                                    language === lng
                                        ? "bg-foreground text-background"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {lng}
                            </button>
                        ))}
                    </div>

                    <Link
                        href={APP_ENTRY_ROUTE}
                        className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                        {t("nav.startConversation")}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default LandingNavigation;
