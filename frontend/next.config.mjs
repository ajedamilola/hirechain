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
  // Empty turbopack config to silence the warning
  turbopack: {},
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
