"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import GeometricBlocksVisual from "./GeometricBlocksVisual";
import { READING_SCENE_CONTENT } from "./content";

const DocumentReadingScene = () => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="wrapper grid items-center gap-12 py-28 lg:grid-cols-2"
        >
            <div>
                <h2 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                    {READING_SCENE_CONTENT.headline}
                </h2>
                <p className="mt-5 max-w-md text-lg text-muted-foreground">{READING_SCENE_CONTENT.subheadline}</p>
            </div>
            <GeometricBlocksVisual />
        </motion.section>
    );
};

export default DocumentReadingScene;
