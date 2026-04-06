/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Apply ./ prefix only when building for Electron
  assetPrefix: process.env.ELECTRON_BUILD === 'true' ? './' : '',
   crossOrigin: false,
};

module.exports = nextConfig;