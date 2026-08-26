import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import AppHeader from "@/components/AppHeader";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { t } = await getServerTranslation();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/library");
  }

  const book = result.data;

  return (
    <div className="book-page-dark">
      <AppHeader />

      <Link href="/library" className="back-btn-floating" aria-label={t("book.backToLibrary")}>
        <ArrowLeft className="size-6 text-[var(--foreground)]" />
      </Link>

      <main className="book-page-container">
        <VapiControls book={book} />
      </main>
    </div>
  );
}
