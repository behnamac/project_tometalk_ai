"use client";

import { motion } from "motion/react";
import { CONVERSATION_SCENE_CONTENT, MOCK_LANDING_CONVERSATION } from "./content";

const bubbleVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

const ConversationScene = () => {
    return (
        <section className="wrapper py-28">
            <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center font-serif text-4xl font-semibold text-foreground sm:text-5xl"
            >
                {CONVERSATION_SCENE_CONTENT.headline}
            </motion.h2>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ staggerChildren: 0.25 }}
                className="mx-auto flex max-w-xl flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:p-8"
            >
                {MOCK_LANDING_CONVERSATION.map((turn, index) => (
                    <motion.div
                        key={index}
                        variants={bubbleVariants}
                        transition={{ duration: 0.5 }}
                        className={turn.role === "user" ? "flex justify-end" : "flex justify-start"}
                    >
                        {turn.role === "user" ? (
                            <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-(--blue) px-5 py-3 text-sm font-medium text-primary-foreground">
                                {turn.text}
                            </p>
                        ) : (
                            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-5 py-4 text-sm text-secondary-foreground">
                                <p className="font-medium">{turn.text}</p>
                                {turn.points && (
                                    <ul className="mt-3 list-disc space-y-1.5 pl-4 text-muted-foreground">
                                        {turn.points.map((point) => (
                                            <li key={point}>{point}</li>
                                        ))}
                                    </ul>
                                )}
                                {turn.citation && (
                                    <p className="mt-3 text-xs text-(--blue)">Source: {turn.citation}</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default ConversationScene;
