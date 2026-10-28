// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8229,
    hmr: {
      overlay: false,
    },
  },
  ssr: {
    external: ["pg", "pg-pool", "pg-types", "bcryptjs", "jsonwebtoken"],
  },
  optimizeDeps: {
    exclude: ["pg"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));