/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  minimize: false,
  experimental: {
    appDir: false,
  },
  transpilePackages: ["@hashgraph/hedera-wallet-connect", "@hashgraph/sdk"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://hirechain.billzpay.com.ng/:path*"
        // destination: "http://localhost:3500/:path*"
      }
    ];
  }
};

export default nextConfig;
