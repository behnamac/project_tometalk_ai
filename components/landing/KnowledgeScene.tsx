"use client";

import { useRef } from "react";
import { useMotionValue, useTransform } from "motion/react";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useIsDesktop } from "./hooks/useIsDesktop";
import KnowledgeGraphSvg from "./KnowledgeGraphSvg";
import { KNOWLEDGE_SCENE_CONTENT } from "./content";

const SceneCopy = () => (
    <div>
        <h2 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {KNOWLEDGE_SCENE_CONTENT.headline}
        </h2>
        <p className="mt-5 max-w-md text-lg text-muted-foreground">{KNOWLEDGE_SCENE_CONTENT.subheadline}</p>
    </div>
);

const KnowledgeScene = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const progress = useScrollProgress(wrapperRef);
    const prefersReducedMotion = usePrefersReducedMotion();
    const isDesktop = useIsDesktop();
    const fullyRevealed = useMotionValue(1);

    const nodeOpacity0 = useTransform(progress, [0.05, 0.25], [0, 1]);
    const nodeOpacity1 = useTransform(progress, [0.12, 0.32], [0, 1]);
    const nodeOpacity2 = useTransform(progress, [0.19, 0.39], [0, 1]);
    const nodeOpacity3 = useTransform(progress, [0.26, 0.46], [0, 1]);
    const nodeOpacity4 = useTransform(progress, [0.33, 0.53], [0, 1]);
    const nodeOpacity5 = useTransform(progress, [0.4, 0.6], [0, 1]);

    const edgeProgress0 = useTransform(progress, [0.45, 0.65], [0, 1]);
    const edgeProgress1 = useTransform(progress, [0.5, 0.7], [0, 1]);
    const edgeProgress2 = useTransform(progress, [0.55, 0.75], [0, 1]);
    const edgeProgress3 = useTransform(progress, [0.6, 0.8], [0, 1]);
    const edgeProgress4 = useTransform(progress, [0.65, 0.85], [0, 1]);
    const edgeProgress5 = useTransform(progress, [0.7, 0.92], [0, 1]);

    if (prefersReducedMotion || isDesktop === false) {
        return (
            <section className="wrapper grid items-center gap-12 py-28 lg:grid-cols-2">
                <SceneCopy />
                <KnowledgeGraphSvg
                    nodeOpacities={[fullyRevealed, fullyRevealed, fullyRevealed, fullyRevealed, fullyRevealed, fullyRevealed]}
                    edgeProgress={[fullyRevealed, fullyRevealed, fullyRevealed, fullyRevealed, fullyRevealed, fullyRevealed]}
                />
            </section>
        );
    }

    return (
        <section ref={wrapperRef} className="relative h-[280vh]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="wrapper grid items-center gap-12 lg:grid-cols-2">
                    <SceneCopy />
                    <KnowledgeGraphSvg
                        nodeOpacities={[nodeOpacity0, nodeOpacity1, nodeOpacity2, nodeOpacity3, nodeOpacity4, nodeOpacity5]}
                        edgeProgress={[edgeProgress0, edgeProgress1, edgeProgress2, edgeProgress3, edgeProgress4, edgeProgress5]}
                    />
                </div>
            </div>
        </section>
    );
};

export default KnowledgeScene;
