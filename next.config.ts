import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "d3e54v103j8qbb.cloudfront.net",
      }
    ],
  },
};

export default nextConfig;
