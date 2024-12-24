import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    outputFileTracing: true, // Garante que Puppeteer e seus binários sejam mantidos no deploy.
};

export default nextConfig;
