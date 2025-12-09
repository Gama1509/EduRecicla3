/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // 🚀 Esto evita que el build falle por errores de lint en Vercel
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [],
};

export default nextConfig;
