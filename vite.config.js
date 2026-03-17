import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 👇 방 이름과 똑같이 적어주세요! (앞뒤로 슬래시 / 잊지 마세요)
  base: '/Corporate-Finance-and-Reality/',
})