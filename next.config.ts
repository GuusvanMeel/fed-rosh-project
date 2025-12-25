import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com",
              "example.com"],
       


  },
  experimental: {
    optimizeCss: false, // Disabled due to missing critters dependency
  },
};

export default nextConfig;
