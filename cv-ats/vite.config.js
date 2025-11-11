import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],  // ← Array of strings atau array
      },
    }),
    tailwindcss(),  // ← Tailwind plugin terpisah
  ],
  server: {
    port: 2000
  }
})