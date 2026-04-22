import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/moonshot': {
        target: 'https://api.moonshot.cn',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/moonshot/, ''),
      },
      '/liepin': {
        target: 'http://open-agent-sandbox20711.sandbox.tongdao.cn/liexiaoxia',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/liepin/, ''),
      },
    },
  }
})
