import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/api/vodhub': {
                target: process.env.API_BASE_URL || 'http://127.0.0.1:8888',
                changeOrigin: true
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['legacy-js-api']
            }
        }
    }
});
