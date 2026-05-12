import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 2007,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@layouts': '/src/layouts',
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@public': '/public',
      '@config': '/src/config',
      '@css': '/src/style',
      '@api': '/src/api',
      '@shared': '/src/shared',
      '@views': '/src/views',
    },
  },

})
