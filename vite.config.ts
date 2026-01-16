import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',          // 👈 importante para producción
  build: {
    outDir: 'dist',   // 👈 carpeta que usará Coolify
    assetsDir: 'assets',
    sourcemap: false // 👈 opcional, recomendado en prod
  }
})
