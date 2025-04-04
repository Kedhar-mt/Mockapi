import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: true,
    allowedHosts: ['https://mockapi-frontend.onrender.com/'], // Add your Render frontend URL here
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    strictPort: true
  }
});
