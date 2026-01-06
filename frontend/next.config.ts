import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This tells Next.js to build static files!
  images: {
    unoptimized: true  // S3 doesn't support Next.js image optimization
  }
};

export default nextConfig;
