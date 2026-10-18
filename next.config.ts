import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
<<<<<<< HEAD
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
=======
>>>>>>> f502f61 (new verison)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
