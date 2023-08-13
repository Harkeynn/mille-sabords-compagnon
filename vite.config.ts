import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /@\/components\/((?!.*[.].*$).*$)/,
        replacement: fileURLToPath(new URL('./src/components/$1/index.vue', import.meta.url))
      },
      {
        find: /@\/components\/((?!.*[.].*$).*$)/,
        replacement: fileURLToPath(new URL('./src/components/$1.vue', import.meta.url))
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  },
  base: '/mille-sabords-compagnon/',
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: '@import "@/assets/styles/main.scss";'
      }
    }
  }
})
