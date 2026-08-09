"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { APP_ENTRY_ROUTE } from "./content";

const SOLID_THRESHOLD = 80;

const LandingNavigation = () => {
    const [isSolid, setIsSolid] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsSolid(latest > SOLID_THRESHOLD);
    });

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
                isSolid ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
            )}
        >
            <div className="wrapper flex items-center justify-between py-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={36} height={22} />
                    <span className="font-serif text-lg font-semibold text-foreground">TomeTalk</span>
                </Link>

                <Link
                    href={APP_ENTRY_ROUTE}
                    className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                    Start a conversation
                </Link>
            </div>
        </header>
    );
};

export default LandingNavigation;
