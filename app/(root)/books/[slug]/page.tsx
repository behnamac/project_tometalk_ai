import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import AppHeader from "@/components/AppHeader";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

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
    <div className="book-page-dark book-page-container">
      <AppHeader />

      <Link href="/library" className="back-btn-floating">
        <ArrowLeft className="size-6 text-[var(--foreground)]" />
      </Link>

      <VapiControls book={book} />
    </div>
  );
}
