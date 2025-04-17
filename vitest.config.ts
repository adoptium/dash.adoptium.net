import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'load-svg',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('.svg')) {
          return 'export default \'img\''
        }
      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts',
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/types/**', 'src/**/__tests__/**', 'src/**/__mocks__/**'],
      reporter: ['text', 'json', 'html']
    }
  }
})
