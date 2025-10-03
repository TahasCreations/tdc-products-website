/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { 
        protocol: "https", 
        hostname: "storage.googleapis.com", 
        pathname: "/tdc-market-storage/**" 
      },
      { 
        protocol: "https", 
        hostname: "storage.googleapis.com", 
        pathname: "/**" 
      }
    ],
  },
};

export default nextConfig;