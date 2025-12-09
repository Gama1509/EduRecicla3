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
        hostname: 'res.cloudinary.com', // ⚡ agregamos Cloudinary
        port: '', // opcional
        pathname: '/**', // opcional, permite cualquier ruta
      },
    ],
  },
  allowedDevOrigins: [],
};

export default nextConfig;
