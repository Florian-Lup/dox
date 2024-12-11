const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, './node_modules/yjs')
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
      ],
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "upgrade-insecure-requests; font-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:;",
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/bCccDwkKkN',
        destination: '/',
        permanent: true,
      },
    ]
  },
  optimizeFonts: true,
}

module.exports = nextConfig
