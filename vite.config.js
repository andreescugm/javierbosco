import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/javierbosco/',     // ← Este es el correcto para tu repo
})
