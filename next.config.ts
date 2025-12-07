import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wavenation-monorepo-qhux.onrender.com",
        port: "",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "https",
        hostname: "wavenation-cms-1dfs.onrender.com",
        port: "",
        pathname: "/api/media/file/**",
      }
    ],
  },
};

export default nextConfig;
