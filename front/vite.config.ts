import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import { VitePluginRadar } from "vite-plugin-radar";

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    VitePluginRadar({
      analytics: {
        id: process.env.GA_TRACKING_ID as string,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
