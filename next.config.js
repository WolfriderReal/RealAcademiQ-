/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production so application code is not exposed to end-users via browser DevTools.
  productionBrowserSourceMaps: false,
  experimental: {
  },
}

module.exports = nextConfig