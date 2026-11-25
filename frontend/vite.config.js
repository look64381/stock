import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendFolder = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: '/stock/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(frontendFolder, 'index.html'),
        stock: resolve(frontendFolder, 'stock.html'),
      },
    },
  },
})
