import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Molex402/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
