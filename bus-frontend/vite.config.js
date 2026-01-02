import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ This configuration connects your frontend (port 5173) to backend (port 5000)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://bus-backend-x2bc.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
