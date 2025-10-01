/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Avoid requiring ESLint to be installed during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
