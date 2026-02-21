import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  transpilePackages: [],
  webpack: (config, { isServer }) => {
    // Ignore the untitled-ui directory to speed up compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/untitled-ui/**', '**/.git/**', '**/.next/**'],
    };
    return config;
  },
};

export default nextConfig;
