'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { authClient } from "@/lib/auth-client";
import { cn, getInitials } from "@/lib/utils";
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
    const { t, i18n } = useTranslation();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
    };

    return (
        <header className="app-header">
            <div className="wrapper flex items-center justify-between py-[18px]">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={26} height={26} className="rounded-[7px]" />
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
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    <span className="block font-medium truncate">{session.user.name}</span>
                                    <span className="block text-xs font-normal text-[var(--muted-foreground)] truncate">
                                        {session.user.email}
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-[var(--muted-foreground)]">
                                    {t("language.label")}
                                </DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={i18n.language} onValueChange={handleLanguageChange}>
                                    <DropdownMenuRadioItem value="en">{t("language.en")}</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="de">{t("language.de")}</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
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
