import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
