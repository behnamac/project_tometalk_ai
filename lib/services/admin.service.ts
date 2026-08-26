import { revalidatePath } from "next/cache";

import prisma from "@/database/prisma";

export interface PurgeUserContentResult {
    voiceSessions: number;
    bookSegments: number;
    books: number;
}

// There is no DB foreign key from Book / BookSegment / VoiceSession to the
// `user` table, so better-auth's removeUser leaves them behind. Purge them
// explicitly. BookSegment.book and VoiceSession.book cascade from Book, so
// deleting the user's books alone already clears most rows — deleting by
// `userId` on all three tables is correct and order-independent.
export async function purgeUserContent(userId: string): Promise<PurgeUserContentResult> {
    const [voiceSessions, bookSegments, books] = await prisma.$transaction([
        prisma.voiceSession.deleteMany({ where: { userId } }),
        prisma.bookSegment.deleteMany({ where: { userId } }),
        prisma.book.deleteMany({ where: { userId } }),
    ]);

    revalidatePath("/library");

    return {
        voiceSessions: voiceSessions.count,
        bookSegments: bookSegments.count,
        books: books.count,
    };
}
