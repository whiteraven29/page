import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      // Same-origin in development: the browser talks to Vite, Vite forwards /api to Django.
      // That keeps the refresh cookie working and means no CORS setup is needed.
      proxy: {
        "/api": { target: env.VITE_BACKEND_URL || "http://127.0.0.1:8000", changeOrigin: true },
        "/admin": { target: env.VITE_BACKEND_URL || "http://127.0.0.1:8000", changeOrigin: true },
        "/static": { target: env.VITE_BACKEND_URL || "http://127.0.0.1:8000", changeOrigin: true },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
    },
  };
});
