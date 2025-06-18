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
    return [
      {
        source: "/api/:path*", // This rule applies to all paths under /api/
        headers: [
          // Allow credentials (e.g., cookies, authorization headers)
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // In production, it's best to be explicit with your domain.
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://classycase.vercel.app",
          },
          // Allow common HTTP methods for API routes, including OPTIONS for preflight
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          // Allow common headers that might be sent with requests
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
