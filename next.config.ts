import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["example.com"], // Add your image host here
  },
  experimental: {
    optimizeCss: false, // Disabled due to missing critters dependency
  },
};

export default nextConfig;
