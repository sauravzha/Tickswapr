import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    build: {
        // Use esbuild (default) for minification
        minify: 'esbuild',
        rollupOptions: {
            output: {
                // Chunk splitting for better caching
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    animations: ['framer-motion']
                }
            }
        },
        // Chunk size warning limit
        chunkSizeWarningLimit: 1000,
        sourcemap: false
    },
    // Preview server config
    preview: {
        port: 4173
    },
    // Dev server config
    server: {
        port: 5173,
        open: true
    }
})
