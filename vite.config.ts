import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const PROD = command === "build" 
  
  return {
    plugins: [react()],
    define: {
      PROD
    },
    build: {
      outDir: "./server/out/server/dist"
    },
    server: {
      proxy: {
        "/room": "http://localhost:5000/",
        "/ws": {
          target: "ws://localhost:5000/",
          ws: true
        }
      }
    },
  }
})
