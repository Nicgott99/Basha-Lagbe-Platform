import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()],
  build: {
    // Raise warning threshold to 600 kB — we are code-splitting so this is expected
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React runtime — tiny, changes rarely → maximum cache hit
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux ecosystem
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          // Animation library — large, isolated for cache
          'vendor-motion': ['framer-motion'],
          // Swiper — only used on Listing page
          'vendor-swiper': ['swiper'],
          // Firebase — only used on OAuth
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          // Form & validation
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          // Icon sets
          'vendor-icons': ['@heroicons/react', 'react-icons', 'lucide-react'],
          // Utilities
          'vendor-utils': ['axios', 'date-fns', 'react-helmet-async'],
        },
      },
    },
  },
})