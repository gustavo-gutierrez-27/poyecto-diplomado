import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Activa el modo estricto de React
  swcMinify: true, // Habilita la minificación utilizando SWC para un rendimiento mejorado
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080', // Configuración de URL de API con HTTP en el puerto 8080
  },
  output: 'export', // Mantiene la salida para exportar
  images: {
    unoptimized: true, // Desactiva la optimización de imágenes
  },
};

export default nextConfig;
