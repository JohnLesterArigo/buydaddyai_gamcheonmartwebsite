/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'automatic-rotary-phone-jj5vg6r64pp63qpw4-3000.app.github.dev',
        'automatic-rotary-phone-jj5vg6r64pp63qpw4-3001.app.github.dev',
        'localhost:3000',
        'localhost:3001'
      ],
    },
  },
};
export default nextConfig;