"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import CapabilityDemoItem from "./CapabilityDemoItem";
import { CAPABILITIES } from "./content";

const CapabilitiesSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const handleVisible = useCallback((index: number) => setActiveIndex(index), []);

    return (
        <section className="wrapper grid gap-12 py-28 lg:grid-cols-[1fr_1.3fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
                <h2 className="text-balance font-serif text-4xl font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                    Everything you need to get answers.
                </h2>
                <div className="mt-8 flex gap-2">
                    {CAPABILITIES.map((capability, index) => (
                        <span
                            key={capability.title}
                            className={cn(
                                "h-1 flex-1 rounded-full transition-colors duration-300",
                                index === activeIndex ? "bg-(--blue)" : "bg-border"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {CAPABILITIES.map((capability, index) => (
                    <CapabilityDemoItem
                        key={capability.title}
                        index={index}
                        title={capability.title}
                        description={capability.description}
                        isActive={index === activeIndex}
                        onVisible={handleVisible}
                    />
                ))}
            </div>
        </section>
    );
};

export default CapabilitiesSection;
