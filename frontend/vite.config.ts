/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
  define: {
    global: 'window',
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 5173,
    
    proxy: {
      // In development, proxy /api requests to backend
      // This avoids CORS entirely during development
      // because the browser sees all requests going to localhost:5173
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Does NOT rewrite — /api/users stays /api/users
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
