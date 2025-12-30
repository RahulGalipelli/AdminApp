import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Required for Render to detect the port
    port: 3002,
    strictPort: false, // Allow port to be changed if needed
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    host: '0.0.0.0', // Required for Render to detect the port
    port: 3002,
    strictPort: false, // Vite will use PORT env var if set by Render
  }
})
