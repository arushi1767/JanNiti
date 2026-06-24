/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed: output: 'export' — was incompatible with next start and server components
  images: {
    unoptimized: true,
  },
  // Allow backend API calls during development
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/api/:path*', destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*` }]
      : []
  },
}

module.exports = nextConfig
