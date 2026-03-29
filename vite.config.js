import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/doragon-boru/',
  server: {
    proxy: {
      '/deepl': {
        target: 'https://api-free.deepl.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/deepl/, ''),
      },
    },
  },
})
