// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

// Dynamically configure Nitro preset:
// - Defaults to "vercel" on Vercel deployment environments
// - Defaults to "node-server" for standard Node.js hosting (cPanel / PM2 / Passenger)
if (process.env.VERCEL || process.env.NOW_BUILDER) {
  process.env.NITRO_PRESET = "vercel";
} else {
  process.env.NITRO_PRESET = process.env.NITRO_PRESET || "node-server";
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

export default defineConfig(({ mode }) => ({
  plugins: [adminApiDevPlugin()],
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
