"use client";

import Link from "next/link";
import { motion } from "motion/react";
import DocumentVisual from "./DocumentVisual";
import { APP_ENTRY_ROUTE, HERO_CONTENT } from "./content";

const HeroSection = () => {
    return (
        <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ backgroundImage: "var(--landing-glow)", backgroundPosition: "80% 20%", backgroundRepeat: "no-repeat" }}
                aria-hidden
            />

            <div className="wrapper grid items-center gap-12 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-(--blue)">
                        {HERO_CONTENT.eyebrow}
                    </p>
                    <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                        {HERO_CONTENT.headline}
                    </h1>
                    <p className="mt-6 max-w-md text-lg text-muted-foreground">{HERO_CONTENT.subheadline}</p>

                    <Link
                        href={APP_ENTRY_ROUTE}
                        className="mt-10 inline-flex items-center justify-center rounded-full bg-(--blue) px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                    >
                        {HERO_CONTENT.primaryCta}
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                >
                    <DocumentVisual />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
