"use client";

import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CONVERSATION_POINT_KEYS } from "./content";

const bubbleVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

const ConversationScene = () => {
    const { t } = useTranslation();

    const points = CONVERSATION_POINT_KEYS.map((key) => t(`landing.conversation.points.${key}`));

    return (
        <section className="wrapper py-28">
            <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center font-serif text-4xl font-semibold tracking-[-0.01em] text-foreground sm:text-5xl"
            >
                {t("landing.conversation.headline")}
            </motion.h2>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ staggerChildren: 0.25 }}
                className="mx-auto flex max-w-xl flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8"
            >
                <motion.div variants={bubbleVariants} transition={{ duration: 0.5 }} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-(--blue) px-5 py-3 text-sm font-medium text-primary-foreground">
                        {t("landing.conversation.userQuestion")}
                    </p>
                </motion.div>

                <motion.div variants={bubbleVariants} transition={{ duration: 0.5 }} className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-5 py-4 text-sm text-secondary-foreground">
                        <p className="font-medium">{t("landing.conversation.assistantIntro")}</p>
                        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-muted-foreground">
                            {points.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <p className="mt-3 text-xs text-(--blue)">
                            {t("landing.conversation.sourceLabel")}: {t("landing.conversation.citation")}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default ConversationScene;
