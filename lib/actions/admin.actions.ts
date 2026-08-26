'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/utils";
import { AdminCreateUserSchema } from "@/lib/zod";
import { ActionResult, AdminCreateUserInput } from "@/types";
import * as adminService from "@/lib/services/admin.service";

type AdminGate =
    | { error: string }
    | { session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>> };

async function requireAdmin(): Promise<AdminGate> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    if (!isAdminRole(session.user.role)) {
        return { error: "You do not have permission to do that." };
    }

    return { session };
}

export const createUser = async (
    input: AdminCreateUserInput,
): Promise<ActionResult<{ id: string }>> => {
    try {
        const gate = await requireAdmin();
        if ("error" in gate) return { success: false, error: gate.error };

        const parsed = AdminCreateUserSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
        }

        const { name, email, password, role } = parsed.data;
        const { user } = await auth.api.createUser({
            headers: await headers(),
            body: { name, email, password, role },
        });

        revalidatePath("/admin/users");
        return { success: true, data: { id: user.id } };
    } catch (e) {
        console.error("Error creating user", e);
        return { success: false, error: (e as Error).message };
    }
};

export const setUserRole = async (
    targetUserId: string,
    makeAdmin: boolean,
): Promise<ActionResult<{ role: string }>> => {
    try {
        const gate = await requireAdmin();
        if ("error" in gate) return { success: false, error: gate.error };

        if (targetUserId === gate.session.user.id) {
            return { success: false, error: "You cannot change your own admin role." };
        }

        const role = makeAdmin ? "admin" : "user";
        await auth.api.setRole({
            headers: await headers(),
            body: { userId: targetUserId, role },
        });

        revalidatePath("/admin/users");
        return { success: true, data: { role } };
    } catch (e) {
        console.error("Error setting user role", e);
        return { success: false, error: (e as Error).message };
    }
};

export const removeUser = async (
    targetUserId: string,
): Promise<ActionResult<{ removed: true }>> => {
    try {
        const gate = await requireAdmin();
        if ("error" in gate) return { success: false, error: gate.error };

        if (targetUserId === gate.session.user.id) {
            return { success: false, error: "You cannot remove your own account." };
        }

        // Purge the user's books/segments/voice sessions first — retrying a
        // failed removeUser afterwards is idempotent, whereas deleting the user
        // first would orphan their content with no way to reach it from the UI.
        await adminService.purgeUserContent(targetUserId);
        await auth.api.removeUser({
            headers: await headers(),
            body: { userId: targetUserId },
        });

        revalidatePath("/admin/users");
        return { success: true, data: { removed: true } };
    } catch (e) {
        console.error("Error removing user", e);
        return { success: false, error: (e as Error).message };
    }
};
