// Entry point for cPanel / PM2 / Passenger / Node.js application
import fs from "node:fs";
import path from "node:path";

// Load .env automatically if present
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"](.*)['"]$/, "$1");
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  // Silent fallback
}

process.env.NODE_ENV = process.env.NODE_ENV || "production";

// Strictly manage port & proxy port from .env
const resolvedPort = process.env.PORT || process.env.PROXY_PORT || "3000";
process.env.PORT = String(resolvedPort);
process.env.NITRO_PORT = String(resolvedPort);

const resolvedHost = process.env.HOST || "0.0.0.0";
process.env.HOST = resolvedHost;
process.env.NITRO_HOST = resolvedHost;

// Start the production Nitro node-server
import("./.output/server/index.mjs")
  .then(() => {
    console.log(`[Elite Nest] Production server initialized successfully on ${resolvedHost}:${resolvedPort}`);
  })
  .catch((err) => {
    console.error("[Startup error]: Failed to launch server:", err);
    process.exit(1);
  });
