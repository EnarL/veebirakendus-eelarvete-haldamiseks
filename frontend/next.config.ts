import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    eslint:{
        ignoreDuringBuilds: true,
    },
    typescript:{
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
