"use client";

import { useReducedMotion } from "motion/react";

/**
 * Wraps Framer's useReducedMotion with an explicit boolean default so
 * callers don't have to deal with the `null` SSR value themselves.
 */
export function usePrefersReducedMotion(): boolean {
    return useReducedMotion() ?? false;
}
