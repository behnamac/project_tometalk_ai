import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import LandingPage from "@/components/landing/LandingPage";

const Page = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (session?.user) {
        redirect("/library");
    }

    return <LandingPage />;
}

export default Page
