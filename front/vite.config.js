import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [react()],
  define:{
    "process.env.NODE_ENV": `"${mode}"`,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
