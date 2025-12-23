/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    domains: [
      "wavenation-cms-1dfs.onrender.com",
      "wavenation-monorepo-qhux.onrender.com",
      "wavenation.media",

      // ✅ SPOTIFY CDN
      "i.scdn.co",
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
      },

      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
