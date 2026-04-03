import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ivxteqtpfrcezwkngtio.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.template.net",
      },
    ],
  },
};

export default nextConfig; 
