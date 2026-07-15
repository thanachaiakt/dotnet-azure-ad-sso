import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  base: '/product',
  plugins: [react()],
  resolve: {
    alias: {
      '@sso/shared': fileURLToPath(new URL('../shared/src', import.meta.url))
    }
  },
  server: {
    port: 5174,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5174,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
