'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Library", href: "/library" },
    { label: "Add New", href: "/books/new" },
];

const LibraryHeader = () => {
    const pathName = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <header className="library-header">
            <div className="wrapper flex items-center justify-between py-[18px]">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={26} height={26} className="rounded-[7px]" />
                    <span className="library-logo-text">TomeTalk</span>
                </Link>

                <nav className="flex items-center gap-7">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href || (href !== "/" && pathName.startsWith(href));

                        return (
                            <Link
                                key={label}
                                href={href}
                                className={cn(
                                    "library-nav-link",
                                    isActive ? "library-nav-link-active" : "library-nav-link-default"
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}

                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            <span className="library-nav-link library-nav-link-default">
                                {session.user.name}
                            </span>
                            <button onClick={handleSignOut} className="library-nav-link library-nav-link-default cursor-pointer">
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link href="/sign-in" className="library-nav-link library-nav-link-default">
                            Sign in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default LibraryHeader;
