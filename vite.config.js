import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Project_3_ToDo/',
  plugins: [
    tailwindcss(),
  ],
})