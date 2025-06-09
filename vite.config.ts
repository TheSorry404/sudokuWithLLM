import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allowedHosts: [
    //   '5173-io6x1zh4jcd641y1vyfn1-2426c704.manus.computer',
    //   'localhost',
    // ],
  },
})
