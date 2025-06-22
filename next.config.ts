import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aoleitrpni.ufs.sh",
      },
    ],
  },
  async headers() {
    // Determine the allowed origin based on the environment
    let allowedOrigin: string;

    if (process.env.NODE_ENV === "development") {
      // In development, allow requests from localhost
      allowedOrigin = "http://localhost:3000"; 
    } else {
      // In production, allow requests from your Vercel domain
      allowedOrigin = "https://classycase.vercel.app";
    }

    return [
      {
        // This rule applies to all paths under /api/auth
        source: "/api/auth/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigin, // Dynamically set origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, next-router-prefetch",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
