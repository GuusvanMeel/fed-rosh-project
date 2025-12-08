import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ["res.cloudinary.com",
              "example.com"],
       


  },
  experimental: {
    optimizeCss: true, // Next.js 13+ only
  },
};
export default nextConfig;
