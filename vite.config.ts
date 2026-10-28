// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

// Ensure Nitro builds standard Node.js server for cPanel / PM2 / Passenger
process.env.NITRO_PRESET = process.env.NITRO_PRESET || "node-server";

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