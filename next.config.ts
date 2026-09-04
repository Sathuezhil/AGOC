import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Middleware buffers request bodies (default 10MB). Profile PDF uploads can be ~100MB.
    middlewareClientMaxBodySize: "100mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
