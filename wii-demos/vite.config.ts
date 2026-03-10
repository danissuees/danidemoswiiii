import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REEMPLAZA 'wii-demos' POR EL NOMBRE REAL DE TU REPOSITORIO EN GITHUB
  base: '/wii-demos/', 
})