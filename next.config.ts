import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ["example.com", "res.cloudinary.com"], // Add your image host here
  },
  experimental: {
    optimizeCss: true, // Next.js 13+ only
  },
};
export default nextConfig;
