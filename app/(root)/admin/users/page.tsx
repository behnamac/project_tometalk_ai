import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/utils";
import { getServerTranslation } from "@/lib/i18n/server";
import AppHeader from "@/components/AppHeader";
import Search from "@/components/Search";
import UsersTable from "@/components/admin/UsersTable";
import AddUserForm from "@/components/admin/AddUserForm";

const PAGE_SIZE = 25;

type SearchParams = { query?: string; page?: string };

const Page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
        redirect("/sign-in?redirect=/admin/users");
    }

    if (!isAdminRole(session.user.role)) {
        redirect("/library");
    }

    const { query, page } = await searchParams;
    const currentPage = Math.max(1, Number(page) || 1);
    const { t } = await getServerTranslation();

    const { users, total } = await auth.api.listUsers({
        headers: requestHeaders,
        query: {
            ...(query
                ? { searchValue: query, searchField: "email", searchOperator: "contains" }
                : {}),
            limit: PAGE_SIZE,
            offset: (currentPage - 1) * PAGE_SIZE,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
    });

    return (
        <div className="admin-dark">
            <AppHeader />

            <main className="library-main">
                <div className="library-title-row">
                    <h1 className="library-title">{t("admin.users.title")}</h1>
                    <Suspense fallback={null}>
                        <Search placeholderKey="admin.users.searchPlaceholder" />
                    </Suspense>
                </div>

                <AddUserForm />

                <Suspense fallback={null}>
                    <UsersTable
                        users={users}
                        currentUserId={session.user.id}
                        total={total}
                        page={currentPage}
                        pageSize={PAGE_SIZE}
                    />
                </Suspense>
            </main>
        </div>
    );
};

export default Page;
