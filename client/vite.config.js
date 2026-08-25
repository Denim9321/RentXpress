import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("🌍 Active API Base URL:", env.VITE_API_BASE_URL);

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "https://rentxpress.onrender.com/api",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    define: {
      "process.env": env,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
