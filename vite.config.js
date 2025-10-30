import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Smart-Weather-App/',  // 👈 Must match your repo name exactly

})
