import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            // This is your existing rule for the placeholder avatars. We keep it!
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
                port: '',
                pathname: '/**',
            },
            // This is our new rule for our legendary Vercel Blob storage.
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.icons8.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};


export default nextConfig;