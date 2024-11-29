import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure the base path is correct (e.g., '/' for root deployment)
  build: {
    outDir: 'dist', // Ensure the output directory matches the one used in Nginx
  },
});
