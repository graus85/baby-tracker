import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Evita che finiscano in bundle più copie di react/react-dom
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-i18next', 'i18next']
  }
})
