import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep Vite's cache outside Dropbox, which locks files while syncing
  cacheDir: path.join(os.tmpdir(), 'hehe-design-vite'),
})
