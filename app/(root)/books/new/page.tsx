import BookUploadHeader from "@/components/BookUploadHeader";
import UploadForm from "@/components/UploadForm";

const Page = () => {
    return (
        <div className="book-upload-dark">
            <BookUploadHeader />

            <main className="book-upload-main">
                <section className="flex flex-col gap-3.5 text-center mb-12">
                    <h1 className="book-upload-title">Add a New Book</h1>
                    <p className="book-upload-subtitle">Upload a PDF to generate your interactive reading experience</p>
                </section>

                <UploadForm />
            </main>
        </div>
    )
}

export default Page
