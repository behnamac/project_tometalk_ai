'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { authClient } from "@/lib/auth-client";
import { cn, getInitials } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { labelKey: "nav.library", href: "/library" },
    { labelKey: "nav.addNew", href: "/books/new" },
];

const AppHeader = () => {
    const pathName = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
    };

    return (
        <header className="app-header" ref={setHeaderEl}>
            <div className="wrapper flex items-center justify-between py-[18px]">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image src="/assets/icon.png" alt="TomeTalk" width={26} height={26} className="rounded-[7px] object-contain" />
                    <span className="app-header-logo-text">TomeTalk</span>
                </Link>

                <nav className="flex items-center gap-7">
                    {navItems.map(({ labelKey, href }) => {
                        const isActive = pathName === href || (href !== "/" && pathName.startsWith(href));

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "app-header-nav-link",
                                    isActive ? "app-header-nav-link-active" : "app-header-nav-link-default"
                                )}
                            >
                                {t(labelKey)}
                            </Link>
                        );
                    })}

                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="app-header-avatar-btn" aria-label="Account menu">
                                    <Avatar>
                                        <AvatarFallback className="app-header-avatar-fallback">
                                            {getInitials(session.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" container={headerEl} className="app-header-dropdown-content">
                                <DropdownMenuLabel>
                                    <span className="app-header-dropdown-name">{session.user.name}</span>
                                    <span className="app-header-dropdown-email">{session.user.email}</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="app-header-dropdown-sublabel">
                                    {t("language.label")}
                                    <div className="app-header-lang-switch" role="group" aria-label={t("language.label")}>
                                        <button
                                            type="button"
                                            onClick={() => handleLanguageChange("en")}
                                            className={cn(
                                                "app-header-lang-switch-btn",
                                                language === "en" && "app-header-lang-switch-btn-active"
                                            )}
                                        >
                                            {t("language.en")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleLanguageChange("de")}
                                            className={cn(
                                                "app-header-lang-switch-btn",
                                                language === "de" && "app-header-lang-switch-btn-active"
                                            )}
                                        >
                                            {t("language.de")}
                                        </button>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                    {t("nav.signOut")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/sign-in" className="app-header-nav-link app-header-nav-link-default">
                            {t("nav.signIn")}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default AppHeader;
