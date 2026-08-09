"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CapabilityDemoItemProps {
    index: number;
    title: string;
    description: string;
    isActive: boolean;
    onVisible: (index: number) => void;
}

const CapabilityDemoItem = ({ index, title, description, isActive, onVisible }: CapabilityDemoItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = itemRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onVisible(index);
            },
            { threshold: 0.6 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [index, onVisible]);

    return (
        <motion.div
            ref={itemRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "rounded-2xl border p-7 transition-colors duration-300",
                isActive ? "border-(--blue)/50 bg-card" : "border-border bg-transparent"
            )}
        >
            <h3 className={cn("text-xl font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                {title}
            </h3>
            <p className="mt-2 text-muted-foreground">{description}</p>
        </motion.div>
    );
};

export default CapabilityDemoItem;
