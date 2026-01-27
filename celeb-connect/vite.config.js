import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy API requests
        '/api': {
          target: 'http://localhost:5000', // Your Backend URL
          changeOrigin: true,
          secure: false,
        },
        // Proxy Image requests (Dynamic based on your .env)
        [`/${env.VITE_PICTURE_BASE}`]: {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})