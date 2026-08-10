import type { NextConfig } from "next";

// The Vercel Blob store hostname is per-project and changes if the store is
// ever rotated/recreated. Override it via NEXT_PUBLIC_BLOB_HOSTNAME rather
// than editing this file; falls back to the current store's hostname.
const blobHostname = process.env.NEXT_PUBLIC_BLOB_HOSTNAME || 'lspfdyhgsrgsxcju.public.blob.vercel-storage.com';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        }
    },
    images: { remotePatterns: [
            { protocol: 'https', hostname: 'covers.openlibrary.org' },
            { protocol: 'https', hostname: blobHostname },
        ]}
};

export default nextConfig;
