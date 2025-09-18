import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for large libraries
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-use', 'react-hot-toast'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['axios', 'nprogress'],
          // Separate chunk for Stripe if used
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js']
          // Removed primereact to avoid chart.js dependency issue
        }
      },
      external: ['chart.js/auto'] // Externalize chart.js to avoid build issues
    },
    // Increase chunk size warning limit to 800kb
    chunkSizeWarningLimit: 800,
    // Disable source maps for production
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
