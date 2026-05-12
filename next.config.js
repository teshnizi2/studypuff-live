/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/',            destination: '/Home.html' },
        { source: '/about',       destination: '/about.html' },
        { source: '/contact',     destination: '/contact.html' },
        { source: '/faq',         destination: '/faq.html' },
        { source: '/resources',   destination: '/resources.html' },
        { source: '/store',       destination: '/store.html' },
        { source: '/study',       destination: '/study.html' },
        { source: '/workshops',   destination: '/workshops.html' },
        { source: '/coming-soon', destination: '/coming-soon.html' }
      ]
    };
  }
};
module.exports = nextConfig;
