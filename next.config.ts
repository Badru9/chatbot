import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@huggingface/transformers"],
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:4000/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
