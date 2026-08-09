import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";

const Page = async () => {
    const { userId } = await auth();

    if (userId) {
        redirect("/library");
    }

    return <LandingPage />;
}

export default Page
