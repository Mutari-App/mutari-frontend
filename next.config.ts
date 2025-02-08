import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    loader: 'default',
    domains: ['res.cloudinary.com'],
  },
}

export default nextConfig
