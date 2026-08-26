'use client';

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { UserWithRole } from "better-auth/plugins";

import { Button } from "@/components/ui/button";
import { cn, isAdminRole } from "@/lib/utils";
import { removeUser, setUserRole } from "@/lib/actions/admin.actions";

interface UsersTableProps {
    users: UserWithRole[];
    currentUserId: string;
    total: number;
    page: number;
    pageSize: number;
}

const UsersTable = ({ users, currentUserId, total, page, pageSize }: UsersTableProps) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

    const visibleUsers = users.filter((user) => !removedIds.has(user.id));

    const pageHref = (targetPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(targetPage));
        return `${pathname}?${params.toString()}`;
    };

    const hasPrev = page > 1;
    const hasNext = page * pageSize < total;

    const dateFormatter = useMemo(
        () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }),
        [],
    );

    const handleRole = (user: UserWithRole, makeAdmin: boolean) => {
        const confirmKey = makeAdmin ? "admin.users.confirmPromote" : "admin.users.confirmDemote";
        if (!window.confirm(t(confirmKey, { email: user.email }))) return;

        startTransition(async () => {
            const result = await setUserRole(user.id, makeAdmin);

            if (result.success) {
                toast.success(t(makeAdmin ? "admin.users.toasts.promoted" : "admin.users.toasts.demoted"));
            } else {
                toast.error(result.error || t("admin.users.toasts.roleFailed"));
            }
        });
    };

    const handleRemove = (user: UserWithRole) => {
        if (!window.confirm(t("admin.users.confirmRemove", { email: user.email }))) return;

        startTransition(async () => {
            const result = await removeUser(user.id);

            if (result.success) {
                setRemovedIds((prev) => new Set(prev).add(user.id));
                toast.success(t("admin.users.toasts.removed"));
            } else {
                toast.error(result.error || t("admin.users.toasts.removeFailed"));
            }
        });
    };

    if (visibleUsers.length === 0) {
        return (
            <div className="library-empty-card">
                <p>{t("admin.users.empty")}</p>
            </div>
        );
    }

    return (
        <>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t("admin.users.columns.name")}</th>
                            <th>{t("admin.users.columns.email")}</th>
                            <th>{t("admin.users.columns.role")}</th>
                            <th>{t("admin.users.columns.created")}</th>
                            <th>{t("admin.users.columns.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleUsers.map((user) => {
                            const isSelf = user.id === currentUserId;
                            const rowIsAdmin = isAdminRole(user.role);

                            return (
                                <tr key={user.id}>
                                    <td>
                                        <span className="admin-name-cell">
                                            {user.name || "—"}
                                            {isSelf && <span className="admin-you-chip">{t("admin.users.you")}</span>}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={cn(
                                                "admin-role-badge",
                                                rowIsAdmin && "admin-role-badge-admin",
                                            )}
                                        >
                                            {t(rowIsAdmin ? "admin.users.role.admin" : "admin.users.role.user")}
                                        </span>
                                    </td>
                                    <td>{dateFormatter.format(new Date(user.createdAt))}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={isSelf || isPending}
                                                onClick={() => handleRole(user, !rowIsAdmin)}
                                            >
                                                {t(rowIsAdmin ? "admin.users.actions.demote" : "admin.users.actions.promote")}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                disabled={isSelf || isPending}
                                                onClick={() => handleRemove(user)}
                                            >
                                                {t("admin.users.actions.remove")}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="admin-pagination">
                <span>{t("admin.users.pagination.status", { page, total })}</span>
                <div className="admin-actions">
                    <Button
                        asChild={hasPrev}
                        variant="outline"
                        size="sm"
                        disabled={!hasPrev}
                    >
                        {hasPrev ? (
                            <Link href={pageHref(page - 1)}>{t("admin.users.pagination.prev")}</Link>
                        ) : (
                            <span>{t("admin.users.pagination.prev")}</span>
                        )}
                    </Button>
                    <Button
                        asChild={hasNext}
                        variant="outline"
                        size="sm"
                        disabled={!hasNext}
                    >
                        {hasNext ? (
                            <Link href={pageHref(page + 1)}>{t("admin.users.pagination.next")}</Link>
                        ) : (
                            <span>{t("admin.users.pagination.next")}</span>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default UsersTable;
