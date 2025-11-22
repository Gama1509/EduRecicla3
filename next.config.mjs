/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Permitir cualquier origen en desarrollo para recursos /_next/*
  allowedDevOrigins: [],
};

export default nextConfig;
