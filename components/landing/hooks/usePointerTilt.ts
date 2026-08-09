"use client";

import { useMotionValue, useSpring, type SpringOptions } from "motion/react";
import { type PointerEvent, type RefObject } from "react";

const SPRING: SpringOptions = { stiffness: 150, damping: 20, mass: 0.5 };
const MAX_TILT_DEG = 8;

/**
 * Pointer-reactive tilt driven entirely by motion values (no React state,
 * no re-renders on move). Attach the returned handlers to the element you
 * want to tilt and bind rotateX/rotateY to the returned motion values.
 */
export function usePointerTilt(containerRef: RefObject<HTMLElement | null>) {
    const rawRotateX = useMotionValue(0);
    const rawRotateY = useMotionValue(0);
    const rotateX = useSpring(rawRotateX, SPRING);
    const rotateY = useSpring(rawRotateY, SPRING);

    const onPointerMove = (event: PointerEvent<HTMLElement>) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

        rawRotateY.set(offsetX * MAX_TILT_DEG);
        rawRotateX.set(offsetY * -MAX_TILT_DEG);
    };

    const onPointerLeave = () => {
        rawRotateX.set(0);
        rawRotateY.set(0);
    };

    return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
