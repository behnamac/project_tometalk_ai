'use client';

import { useEffect, useRef } from 'react';

// Keeps a ref in sync with the latest value so long-lived callbacks (event
// handlers, interval callbacks) can read current state without re-subscribing.
export function useLatestRef<T>(value: T) {
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref;
}
