"use client";

import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { USE_CASE_KEYS } from "./content";

const UseCasesSection = () => {
    const { t } = useTranslation();

    return (
        <section className="wrapper py-28">
            <div className="mb-14 max-w-lg">
                <h2 className="text-balance font-serif text-4xl font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                    {t("landing.useCases.heading")}
                </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {USE_CASE_KEYS.map((key, index) => (
                    <motion.article
                        key={key}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-(--blue)/50"
                    >
                        <h3 className="font-serif text-2xl font-semibold text-foreground">
                            {t(`landing.useCases.items.${key}.title`)}
                        </h3>
                        <p className="mt-3 text-muted-foreground">
                            {t(`landing.useCases.items.${key}.description`)}
                        </p>
                        <p className="mt-6 rounded-xl border border-(--landing-line) bg-background/60 px-4 py-3 text-sm text-foreground/80">
                            {t(`landing.useCases.items.${key}.example`)}
                        </p>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default UseCasesSection;
