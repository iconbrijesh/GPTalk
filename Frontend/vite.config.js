// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  // ✅ This ensures deep links work on Render
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});