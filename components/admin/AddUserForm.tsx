'use client';

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { AdminCreateUserSchema } from "@/lib/zod";
import { AdminCreateUserInput } from "@/types";
import { createUser } from "@/lib/actions/admin.actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddUserForm = () => {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const form = useForm<AdminCreateUserInput>({
        resolver: zodResolver(AdminCreateUserSchema),
        defaultValues: { name: "", email: "", password: "", role: "user" },
    });

    const onSubmit = (values: AdminCreateUserInput) => {
        startTransition(async () => {
            const result = await createUser(values);

            if (result.success) {
                form.reset();
                toast.success(t("admin.users.toasts.created"));
            } else {
                toast.error(result.error || t("admin.users.toasts.createFailed"));
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="admin-add-form">
                <p className="admin-add-form-title">{t("admin.users.form.title")}</p>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="admin-field">
                            <FormLabel className="admin-field-label">{t("admin.users.form.nameLabel")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("admin.users.form.namePlaceholder")}
                                    autoComplete="off"
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="admin-field">
                            <FormLabel className="admin-field-label">{t("admin.users.form.emailLabel")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={t("admin.users.form.emailPlaceholder")}
                                    autoComplete="off"
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="admin-field">
                            <FormLabel className="admin-field-label">{t("admin.users.form.passwordLabel")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder={t("admin.users.form.passwordPlaceholder")}
                                    autoComplete="off"
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="admin-field">
                            <FormLabel className="admin-field-label">{t("admin.users.form.roleLabel")}</FormLabel>
                            <FormControl>
                                <select className="admin-select" disabled={isPending} {...field}>
                                    <option value="user">{t("admin.users.form.roleUser")}</option>
                                    <option value="admin">{t("admin.users.form.roleAdmin")}</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>
                    {isPending ? t("admin.users.form.submitting") : t("admin.users.form.submit")}
                </Button>
            </form>
        </Form>
    );
};

export default AddUserForm;
