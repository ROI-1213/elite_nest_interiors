// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";
import fs from "node:fs";

// Load .env automatically so port, allowed_hosts, and database variables are immediately available
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
} catch {
  // Silent fallback
}

// Dynamically configure Nitro preset:
// - Defaults to "vercel" on Vercel deployment environments
// - Defaults to "node-server" for standard Node.js hosting (cPanel / PM2 / Passenger)
if (process.env.VERCEL || process.env.NOW_BUILDER) {
  process.env.NITRO_PRESET = "vercel";
} else {
  process.env.NITRO_PRESET = process.env.NITRO_PRESET || "node-server";
}

function resolveAllowedHosts(): boolean | string[] {
  const raw = process.env.ALLOWED_HOSTS?.trim();
  if (!raw || raw.toLowerCase() === "all" || raw === "*" || raw.toLowerCase() === "true") {
    return true; // Allow all incoming hosts & proxies without host-blocking error
  }
  return raw.split(",").map((h) => h.trim()).filter(Boolean);
}

function getActivePort(defaultPort: number): number {
  const envPort = process.env.PORT || process.env.PROXY_PORT;
  return envPort ? Number(envPort) : defaultPort;
}

function adminApiDevPlugin() {
  return {
    name: "admin-api-dev-plugin",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const rawUrl = req.url || "";
        if (
          rawUrl.startsWith("/api/admin/") ||
          rawUrl.startsWith("/api/auth/") ||
          rawUrl.startsWith("/api/storage/") ||
          rawUrl.startsWith("/storage/")
        ) {
          try {
            const { handleAdminApi } = await server.ssrLoadModule("/src/server.ts");
            const protocol = req.headers["x-forwarded-proto"] || "http";
            const host = req.headers.host || "localhost";
            const fullUrl = `${protocol}://${host}${req.url}`;

            const headers = new Headers();
            for (const [k, v] of Object.entries(req.headers)) {
              if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : String(v));
            }

            let body: any = null;
            if (req.method !== "GET" && req.method !== "HEAD") {
              const chunks: any[] = [];
              for await (const chunk of req) chunks.push(chunk);
              body = Buffer.concat(chunks);
            }

            const webReq = new Request(fullUrl, {
              method: req.method,
              headers,
              body: body && body.length > 0 ? body : undefined,
              duplex: "half",
            } as any);

            const apiRes = await handleAdminApi(webReq);
            if (apiRes) {
              res.statusCode = apiRes.status;
              for (const [k, v] of apiRes.headers.entries()) {
                res.setHeader(k, v);
              }
              const ab = await apiRes.arrayBuffer();
              return res.end(Buffer.from(ab));
            }
          } catch (e: any) {
            console.error("[Vite Dev API Error]:", e);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ success: false, error: e?.message || "Internal Dev API error" }));
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const allowedHosts = resolveAllowedHosts();
  const serverPort = getActivePort(8229);
  const previewPort = getActivePort(3000);
  const host = process.env.HOST || "0.0.0.0";

  return {
    plugins: [adminApiDevPlugin()],
    server: {
      host,
      port: serverPort,
      allowedHosts,
      hmr: {
        overlay: false,
      },
    },
    preview: {
      host,
      port: previewPort,
      allowedHosts,
    },
    ssr: {
      external: ["pg", "pg-pool", "pg-types", "bcryptjs", "jsonwebtoken"],
    },
    optimizeDeps: {
      exclude: ["pg"],
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname || ".", "./src"),
      },
    },
  };
});
