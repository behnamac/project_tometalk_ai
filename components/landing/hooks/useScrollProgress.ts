"use client";

import { useScroll, type MotionValue } from "motion/react";
import { type RefObject } from "react";

/**
 * Tracks scroll progress (0 -> 1) of a tall wrapper element as it passes
 * through the viewport. Meant to drive a `position: sticky` inner panel.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>): MotionValue<number> {
    const { scrollYProgress } = useScroll({
        target,
        offset: ["start start", "end end"],
    });

    return scrollYProgress;
}
