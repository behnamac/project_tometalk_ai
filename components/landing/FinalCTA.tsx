"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import OrbitingCircleVisual from "./OrbitingCircleVisual";
import { APP_ENTRY_ROUTE } from "./content";

const FinalCTA = () => {
    const { t } = useTranslation();

    return (
        <section className="relative overflow-hidden py-32">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ backgroundImage: "var(--landing-glow)", backgroundPosition: "20% 50%", backgroundRepeat: "no-repeat" }}
                aria-hidden
            />

            <div className="wrapper grid items-center gap-12 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="order-2 lg:order-1 motion-safe:animate-[float_6s_ease-in-out_infinite]"
                >
                    <OrbitingCircleVisual />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="order-1 lg:order-2"
                >
                    <h2 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-[-0.01em] text-foreground sm:text-5xl">
                        {t("landing.finalCta.headline")}
                        <br />
                        {t("landing.finalCta.subheadline")}
                    </h2>

                    <Link
                        href={APP_ENTRY_ROUTE}
                        className="mt-10 inline-flex items-center justify-center rounded-full bg-(--blue) px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                    >
                        {t("landing.finalCta.primaryCta")}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
