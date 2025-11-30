import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',  // Google
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',  // GitHub
      },
      {
        protocol: 'https',
        hostname: 'cdn.monkarc.com',  // Your CDN
      },
    ],
  }
};

export default nextConfig;
