import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
