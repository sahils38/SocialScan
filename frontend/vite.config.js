import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react', 'playwright-core'],  // Exclude both Playwright and lucide-react from optimization
  },

  build: {
    rollupOptions: {
      external: ['playwright-core'],  // Ensure playwright-core is not bundled into the final build
    },
   
      outDir: 'dist', // Ensure this is set correctly
    
  },

  ssr: {
    external: ['playwright-core'],  // Exclude Playwright from SSR bundling if you're using SSR
  },

  server: {
    fs: {
      // If you're using Vite's server for local dev, make sure playwright is not accessed on the frontend
      allow: ['..'],
    },
  },
});
