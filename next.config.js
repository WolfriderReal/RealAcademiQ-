/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production so application code is not exposed to end-users via browser DevTools.
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
  // Redirect www → apex once realacademiq.com DNS is active
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.realacademiq.com' }],
        destination: 'https://realacademiq.com/:path*',
        permanent: true,
      },
    ]
  },
  experimental: {
  },
}

module.exports = nextConfig