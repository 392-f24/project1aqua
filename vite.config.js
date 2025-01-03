import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    mockReset: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  }
});