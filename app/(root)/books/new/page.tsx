import AppHeader from "@/components/AppHeader";
import UploadForm from "@/components/UploadForm";
import { getServerTranslation } from "@/lib/i18n/server";

const Page = async () => {
    const { t } = await getServerTranslation();

    return (
        <div className="book-upload-dark">
            <AppHeader />

            <main className="book-upload-main">
                <section className="flex flex-col gap-3.5 text-center mb-12">
                    <h1 className="book-upload-title">{t("upload.pageTitle")}</h1>
                    <p className="book-upload-subtitle">{t("upload.pageSubtitle")}</p>
                </section>

                <UploadForm />
            </main>
        </div>
    )
}

export default Page
