import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sushanka.com.np',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Spotify album art
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub avatars (auth)
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars (auth)
      },
    ],
  },
};

export default nextConfig;
