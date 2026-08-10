'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Library", href: "/library" },
    { label: "Add New", href: "/books/new" },
    { label: "Pricing", href: "/subscriptions" },
];

const BookUploadHeader = () => {
    const pathName = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <header className="book-upload-header">
            <div className="wrapper flex items-center justify-between py-[18px]">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={26} height={26} className="rounded-[7px]" />
                    <span className="book-upload-logo-text">TomeTalk</span>
                </Link>

                <nav className="flex items-center gap-7">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href || (href !== "/" && pathName.startsWith(href));

                        return (
                            <Link
                                key={label}
                                href={href}
                                className={cn(
                                    "book-upload-nav-link",
                                    isActive ? "book-upload-nav-link-active" : "book-upload-nav-link-default"
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}

                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/subscriptions" className="book-upload-nav-link book-upload-nav-link-default">
                                {session.user.name}
                            </Link>
                            <button onClick={handleSignOut} className="book-upload-nav-link book-upload-nav-link-default cursor-pointer">
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link href="/sign-in" className="book-upload-nav-link book-upload-nav-link-default">
                            Sign in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default BookUploadHeader;
