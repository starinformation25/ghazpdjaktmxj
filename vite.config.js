import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // APK 래퍼(WebView)는 dist를 file:// 로 읽는다.
  // base가 '/'면 절대경로라 자산을 못 찾고 흰 화면이 뜬다. 반드시 './' 유지.
  base: './',
})
