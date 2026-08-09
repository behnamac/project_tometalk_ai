"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribe(callback: () => void) {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
    return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerSnapshot() {
    return false;
}

/**
 * SSR-safe desktop breakpoint check via useSyncExternalStore, so external
 * (browser) state is read without a setState-in-effect cascading render.
 * Renders `false` (mobile fallback) until the client snapshot syncs in.
 */
export function useIsDesktop(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
