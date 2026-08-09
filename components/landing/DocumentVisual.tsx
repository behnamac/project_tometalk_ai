"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { usePointerTilt } from "./hooks/usePointerTilt";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const TEXT_LINE_WIDTHS = [72, 92, 84, 60, 88, 76, 40];

interface DocumentVisualProps {
    className?: string;
}

const DocumentVisual = ({ className }: DocumentVisualProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const { rotateX, rotateY, onPointerMove, onPointerLeave } = usePointerTilt(containerRef);

    return (
        <div
            ref={containerRef}
            onPointerMove={prefersReducedMotion ? undefined : onPointerMove}
            onPointerLeave={prefersReducedMotion ? undefined : onPointerLeave}
            className={cn("relative mx-auto aspect-[4/5] w-full max-w-sm [perspective:1200px]", className)}
        >
            {/* Back pages, subtly offset for depth */}
            <div className="absolute inset-0 translate-x-3 translate-y-4 rounded-2xl border border-(--landing-line) bg-card/40" />
            <div className="absolute inset-0 translate-x-1.5 translate-y-2 rounded-2xl border border-(--landing-line) bg-card/60" />

            <motion.div
                style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
                className="relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] [transform-style:preserve-3d]"
            >
                <div className="mb-2 h-2 w-16 rounded-full bg-(--blue)/70" />

                {TEXT_LINE_WIDTHS.map((width, index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-2 rounded-full",
                            index === 2 ? "bg-(--blue)/60" : "bg-muted-foreground/25"
                        )}
                        style={{ width: `${width}%` }}
                    />
                ))}

                <div className="mt-auto flex items-center gap-2 rounded-full border border-(--landing-line) bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-(--blue)" />
                    Understood
                </div>
            </motion.div>
        </div>
    );
};

export default DocumentVisual;
