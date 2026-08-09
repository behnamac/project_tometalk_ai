"use client";

import { motion } from "motion/react";
import { USE_CASES } from "./content";

const UseCasesSection = () => {
    return (
        <section className="wrapper py-28">
            <div className="mb-14 max-w-lg">
                <h2 className="text-balance font-serif text-4xl font-semibold text-foreground sm:text-5xl">
                    Built for how you already read.
                </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {USE_CASES.map((useCase, index) => (
                    <motion.article
                        key={useCase.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-(--blue)/50"
                    >
                        <h3 className="font-serif text-2xl font-semibold text-foreground">{useCase.title}</h3>
                        <p className="mt-3 text-muted-foreground">{useCase.description}</p>
                        <p className="mt-6 rounded-xl border border-(--landing-line) bg-background/60 px-4 py-3 text-sm text-foreground/80">
                            {useCase.example}
                        </p>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default UseCasesSection;
