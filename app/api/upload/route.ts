import {NextResponse} from "next/server";
import {handleUpload, HandleUploadBody} from "@vercel/blob/client";
import {auth} from "@/lib/auth";
import {MAX_FILE_SIZE, ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES} from "@/lib/constants/upload";

class UnauthorizedUploadError extends Error {}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = (await request.json()) as HandleUploadBody;

        const jsonResponse = await handleUpload({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            body,
            request,
            onBeforeGenerateToken: async () => {
                const session = await auth.api.getSession({ headers: request.headers });
                const userId = session?.user?.id;

                if(!userId) {
                    throw new UnauthorizedUploadError('User not authenticated');
                }

                return {
                    allowedContentTypes: [...ACCEPTED_PDF_TYPES, ...ACCEPTED_IMAGE_TYPES],
                    addRandomSuffix: true,
                    maximumSizeInBytes: MAX_FILE_SIZE,
                    tokenPayload: JSON.stringify({ userId })
                }
        } ,
            onUploadCompleted: async ({ blob }) => {
                console.log('File uploaded to blob: ', blob.url)
            }
        });

        return NextResponse.json(jsonResponse)
    } catch (e) {
        console.error('Upload error', e);
        const isUnauthorized = e instanceof UnauthorizedUploadError;
        const status = isUnauthorized ? 401 : 500;
        const clientMessage = isUnauthorized ? 'Unauthorized' : 'Upload failed';
        return NextResponse.json({ error: clientMessage }, { status });
    }
}
