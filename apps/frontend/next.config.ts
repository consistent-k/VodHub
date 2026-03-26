import { NextConfig } from 'next';

const mode: NextConfig['output'] = (process.env.BUILD_MODE as NextConfig['output']) ?? 'standalone';
console.log('[Next] build mode', mode);

const disableChunk = !!process.env.DISABLE_CHUNK || mode === 'export';
console.log('[Next] build with chunk: ', !disableChunk);

const nextConfig: NextConfig = {
    output: mode,
    images: {
        unoptimized: mode === 'export'
    },
    reactStrictMode: false,
    sassOptions: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api']
    }
};

if (mode !== 'export') {
    nextConfig.redirects = async () => [
        {
            source: '/',
            destination: '/home',
            permanent: true
        }
    ];

    nextConfig.rewrites = async () => [
        {
            source: '/api/vodhub/:path*',
            destination: 'http://127.0.0.1:8888/api/vodhub/:path*'
        }
    ];
}

export default nextConfig;
