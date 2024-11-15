/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {ignoreDuringBuilds: false},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',

      },
    ],
  },
};

export default nextConfig;
