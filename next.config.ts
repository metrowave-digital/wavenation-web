import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    domains: [
      "wavenation-cms-1dfs.onrender.com",
      "wavenation-monorepo-qhux.onrender.com",
      "wavenation.media"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wavenation-monorepo-qhux.onrender.com",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "https",
        hostname: "wavenation-cms-1dfs.onrender.com",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "https",
        hostname: "wavenation.media",
        pathname: "/api/media/file/**",
      }
    ],
  },
};

export default nextConfig;
