// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   serverExternalPackages: ["@huggingface/transformers"],
//   async rewrites() {
//     return [
//       {
//         source: "/api/auth/:path*",
//         destination: "http://localhost:4000/api/auth/:path*",
//       },
//     ];
//   },
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "5mb",
//     },
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";
// import type { Configuration } from "webpack";

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
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // // ←‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑-
  // webpack(config: Configuration, { isServer }) {
  //   // PDF.js worker handling
  //   config.module?.rules?.push({
  //     test: /pdf\.worker\.m?js$/,
  //     use: [
  //       {
  //         loader: "file-loader",
  //         options: {
  //           // hash‑named file, Vercel‑friendly static path
  //           name: "[name].[contenthash].[ext]",
  //           publicPath: "/_next/static/workers/",
  //           outputPath: "static/workers/",
  //         },
  //       },
  //     ],
  //   });

  //   // jangan load worker di server side
  //   if (isServer) {
  //     config.externals = [
  //       ...(config.externals || []),
  //       // treat worker as external to avoid SSR import errors
  //       /pdf\.worker\.m?js$/,
  //     ];
  //   }

  //   return config;
  // },
};

export default nextConfig;
