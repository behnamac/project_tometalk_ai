'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// Guards against hydration mismatches for client-only state (e.g. session
// data resolved from cookies/localStorage): returns false on the server and
// during the first client render, then true once hydration has completed.
export function useIsMounted(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
}
