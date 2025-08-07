/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dttvkmjpd/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/djuta2tca/image/upload/**',
      },
    {
  protocol: 'https',
  hostname: 'minio.swiftsyn.com',
  port: '',
  pathname: '/kamukunjikonnect/**',
},
    ],
  },

};

module.exports = nextConfig;