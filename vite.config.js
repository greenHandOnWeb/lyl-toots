import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@climblee/uv-ui': path.resolve(__dirname, 'node_modules/@climblee/uv-ui'),
    },
  },
  optimizeDeps: {
    include: ['@climblee/uv-ui'],
  },
})
