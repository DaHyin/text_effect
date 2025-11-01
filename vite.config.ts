import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel 배포용 (로컬 테스트 시 './'로 변경 가능)
})


