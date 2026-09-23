import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las categorías son filtros del catálogo, no páginas propias.
  async redirects() {
    return [
      { source: "/catalogo", destination: "/productos", permanent: true },
      { source: "/paneles-ranurados", destination: "/productos?categoria=paneles-ranurados", permanent: true },
      { source: "/mobiliario", destination: "/productos?categoria=mobiliario-comercial", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "twzceyqunrkialkefrpa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
