'use client';

import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import {Search as SearchIcon} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useTranslation} from "react-i18next";

const Search = ({ placeholderKey = "library.searchPlaceholder" }: { placeholderKey?: string }) => {
    const {t} = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState(searchParams.get('query') || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const previousQuery = params.get('query') || '';

            if (query) {
                params.set('query', query);
            } else {
                params.delete('query');
            }

            // A new search term restarts pagination from the first page.
            if (query !== previousQuery) {
                params.delete('page');
            }

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, pathname, router]);

    return (
        <div className="library-search-wrapper">
            <div className="pl-4">
                <SearchIcon
                    size={20}
                    className="text-[var(--text-muted)]"
                />
            </div>
            <Input
                type="text"
                placeholder={t(placeholderKey)}
                className="library-search-input border-none shadow-none focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default Search;
