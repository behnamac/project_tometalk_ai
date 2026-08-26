"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import CapabilityDemoItem from "./CapabilityDemoItem";
import { CAPABILITY_KEYS } from "./content";

const CapabilitiesSection = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const handleVisible = useCallback((index: number) => setActiveIndex(index), []);

    return (
        <section className="wrapper grid gap-12 py-28 lg:grid-cols-[1fr_1.3fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
                <h2 className="text-balance font-serif text-4xl font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                    {t("landing.capabilities.heading")}
                </h2>
                <div className="mt-8 flex gap-2">
                    {CAPABILITY_KEYS.map((key, index) => (
                        <span
                            key={key}
                            className={cn(
                                "h-1 flex-1 rounded-full transition-colors duration-300",
                                index === activeIndex ? "bg-(--blue)" : "bg-border"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {CAPABILITY_KEYS.map((key, index) => (
                    <CapabilityDemoItem
                        key={key}
                        index={index}
                        title={t(`landing.capabilities.items.${key}.title`)}
                        description={t(`landing.capabilities.items.${key}.description`)}
                        isActive={index === activeIndex}
                        onVisible={handleVisible}
                    />
                ))}
            </div>
        </section>
    );
};

export default CapabilitiesSection;
