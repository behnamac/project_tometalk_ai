'use client';

import Link from "next/link";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {cn} from "@/lib/utils";

const navItems = [
    { label: "Library", href: "/library" },
    { label: "Add New", href: "/books/new" },
]

const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    if (pathName === "/" || pathName === "/books/new" || pathName === "/sign-in" || pathName === "/sign-up" || pathName === "/library") return null;

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <header className="w-full fixed z-50 bg-(--bg-primary)">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={42} height={26} />
                    <span className="logo-text">TomeTalk</span>
                </Link>

                <nav className="w-fit flex gap-7.5 items-center">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));

                        return (
                            <Link href={href} key={label} className={cn('nav-link-base', isActive ? 'nav-link-active' : 'text-black hover:opacity-70')}>
                                {label}
                            </Link>
                        )
                    })}

                    <div className="flex gap-7.5 items-center">
                        {session?.user ? (
                            <div className="nav-user-link">
                                <span className="nav-user-name">
                                    {session.user.name}
                                </span>
                                <button onClick={handleSignOut} className="nav-btn">
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <Link href="/sign-in" className="nav-btn">
                                Sign in
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
