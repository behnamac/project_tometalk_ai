"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useIsDesktop } from "./hooks/useIsDesktop";
import { READING_SCENE_CONTENT } from "./content";

const FRAGMENTS = [
    { label: "Key finding", x: 120, y: -60 },
    { label: "Definition", x: 140, y: 20 },
    { label: "Context", x: 110, y: 100 },
] as const;

interface FragmentStyle {
    opacity: MotionValue<number>;
    x: MotionValue<number>;
    y: MotionValue<number>;
}

const SceneCopy = () => (
    <div>
        <h2 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {READING_SCENE_CONTENT.headline}
        </h2>
        <p className="mt-5 max-w-md text-lg text-muted-foreground">{READING_SCENE_CONTENT.subheadline}</p>
    </div>
);

const OpeningDocument = ({ pageOffset, fragmentStyles }: {
    pageOffset: MotionValue<number>;
    fragmentStyles: readonly [FragmentStyle, FragmentStyle, FragmentStyle];
}) => (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
        <motion.div
            style={{ x: pageOffset, y: pageOffset }}
            className="absolute inset-0 rounded-2xl border border-(--landing-line) bg-card/50"
        />
        <div className="relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="mb-2 h-2 w-16 rounded-full bg-(--blue)/70" />
            {[72, 92, 84, 60, 88].map((width, index) => (
                <div
                    key={index}
                    className="h-2 rounded-full bg-muted-foreground/25"
                    style={{ width: `${width}%` }}
                />
            ))}
        </div>

        {FRAGMENTS.map((fragment, index) => (
            <motion.div
                key={fragment.label}
                style={fragmentStyles[index]}
                className="absolute right-0 top-1/2 rounded-full border border-(--landing-line) bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg"
            >
                {fragment.label}
            </motion.div>
        ))}
    </div>
);

const DocumentReadingScene = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const progress = useScrollProgress(wrapperRef);
    const prefersReducedMotion = usePrefersReducedMotion();
    const isDesktop = useIsDesktop();

    const pageOffset = useTransform(progress, [0, 1], [0, 14]);

    const fragmentOneOpacity = useTransform(progress, [0.2, 0.6], [0, 1]);
    const fragmentOneX = useTransform(fragmentOneOpacity, [0, 1], [0, FRAGMENTS[0].x]);
    const fragmentOneY = useTransform(fragmentOneOpacity, [0, 1], [0, FRAGMENTS[0].y]);

    const fragmentTwoOpacity = useTransform(progress, [0.35, 0.75], [0, 1]);
    const fragmentTwoX = useTransform(fragmentTwoOpacity, [0, 1], [0, FRAGMENTS[1].x]);
    const fragmentTwoY = useTransform(fragmentTwoOpacity, [0, 1], [0, FRAGMENTS[1].y]);

    const fragmentThreeOpacity = useTransform(progress, [0.5, 0.9], [0, 1]);
    const fragmentThreeX = useTransform(fragmentThreeOpacity, [0, 1], [0, FRAGMENTS[2].x]);
    const fragmentThreeY = useTransform(fragmentThreeOpacity, [0, 1], [0, FRAGMENTS[2].y]);

    const fragmentStyles: readonly [FragmentStyle, FragmentStyle, FragmentStyle] = [
        { opacity: fragmentOneOpacity, x: fragmentOneX, y: fragmentOneY },
        { opacity: fragmentTwoOpacity, x: fragmentTwoX, y: fragmentTwoY },
        { opacity: fragmentThreeOpacity, x: fragmentThreeX, y: fragmentThreeY },
    ];

    if (prefersReducedMotion || isDesktop === false) {
        return (
            <section className="wrapper grid items-center gap-12 py-28 lg:grid-cols-2">
                <SceneCopy />
                <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                    <div className="mb-2 h-2 w-16 rounded-full bg-(--blue)/70" />
                    {[72, 92, 84, 60, 88].map((width, index) => (
                        <div key={index} className="mb-3 h-2 rounded-full bg-muted-foreground/25" style={{ width: `${width}%` }} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section ref={wrapperRef} className="relative h-[250vh]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="wrapper grid items-center gap-12 lg:grid-cols-2">
                    <SceneCopy />
                    <OpeningDocument pageOffset={pageOffset} fragmentStyles={fragmentStyles} />
                </div>
            </div>
        </section>
    );
};

export default DocumentReadingScene;
