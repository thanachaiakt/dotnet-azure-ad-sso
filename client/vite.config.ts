import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@sso/shared-ui': fileURLToPath(new URL('../shared-ui/src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/product': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
