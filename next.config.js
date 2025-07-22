/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    dirs: ['src'],
  },
};

module.exports = nextConfig;