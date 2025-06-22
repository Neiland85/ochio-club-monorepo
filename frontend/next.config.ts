import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
    return config;
  }
};

export default nextConfig;
