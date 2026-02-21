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

    // Fix pdf-parse trying to access test files during build
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
      });
    }

    return config;
  },
};

export default nextConfig;
