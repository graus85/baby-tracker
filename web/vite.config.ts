import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Evita copie multiple di react/react-dom (dev e build)
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  // Non pre-bundlare react: alcune config lo duplicano
  optimizeDeps: {
    exclude: ['react', 'react-dom']
  }
})
