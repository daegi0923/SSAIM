import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: 'window' // 브라우저 환경에서 global 변수를 window로 정의
  }
});