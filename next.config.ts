import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  serverExternalPackages: [
    "knex",
    "pg",
    "bcrypt",
    "cloudinary",
    "jsonwebtoken",
    "dotenv",
  ],
};

export default nextConfig;
