import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['port9002-workspaces-ws-s8jui.us10.trial.applicationstudio.cloud.sap'],
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
