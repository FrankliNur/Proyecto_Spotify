import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,    // Siempre usará este puerto
    strictPort: true, // No buscará puertos alternativos
    host: true      // Opcional: Permite acceso desde la red local
  }
})