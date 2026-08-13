import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from a /Molex402/ sub path; Vercel serves it
// from the root of its own domain. Everything else about the build is shared.
const forPages = process.env.DEPLOY_TARGET === 'gh-pages'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: forPages ? '/Molex402/' : '/',
  build: {
    outDir: forPages ? '../docs' : 'dist',
    emptyOutDir: true,
  },
})
