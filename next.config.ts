import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.tcgcollector.com',
      },
    ],
  },
};
export default nextConfig;
