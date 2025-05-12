import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const manifest: Partial<ManifestOptions> = {
    name: 'Syncmate',
    short_name: 'Syncmate',
    icons: [
        {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
        },
        {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
        }
    ],
    theme_color: '#1E1E1E',
    background_color: '#1E1E1E',
    display: 'standalone'
};

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        svgr(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{html,css,js,ico,png,svg}']
            },
            manifest: manifest
        }),
        ViteImageOptimizer()
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        const modulePath = id.split('node_modules/')[1];
                        const topLevelFolder = modulePath?.split('/')[0];

                        if (topLevelFolder !== '.pnpm') return topLevelFolder;

                        const scopedPackageName = modulePath?.split('/')[1];

                        return scopedPackageName?.split('@')[scopedPackageName.startsWith('@') ? 1 : 0];
                    }
                }
            }
        }
    },
    esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
}));