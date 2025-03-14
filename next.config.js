/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "lh3.googleusercontent.com", // Para imágenes de Google Auth
      "res.cloudinary.com", // Si usas Cloudinary
      "images.unsplash.com", // Para imágenes de prueba
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
