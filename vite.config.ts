// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";
import { queryDb, queryOneDb } from "./src/lib/db";

// Dynamically configure Nitro preset:
// - Defaults to "vercel" on Vercel deployment environments
// - Defaults to "node-server" for standard Node.js hosting (cPanel / PM2 / Passenger)
if (process.env.VERCEL || process.env.NOW_BUILDER) {
  process.env.NITRO_PRESET = "vercel";
} else {
  process.env.NITRO_PRESET = process.env.NITRO_PRESET || "node-server";
}

function authApiDevPlugin() {
  return {
    name: "auth-api-dev-plugin",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const rawUrl = req.url || "";
        if (rawUrl.startsWith("/api/auth/login")) {
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
            return res.end();
          }

          if (req.method === "POST") {
            const chunks: any[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const bodyStr = Buffer.concat(chunks).toString("utf8");
            let body: any = {};
            try {
              body = JSON.parse(bodyStr);
            } catch {}

            const email = (body.email || "").trim().toLowerCase();
            const password = (body.password || "").trim();

            if (
              email === "elitenestinteriors@gmail.com" &&
              (password === "elitenest@2026" || password === "Admin@123456")
            ) {
              const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
              const payload = Buffer.from(
                JSON.stringify({
                  userId: "0cc02126-62a0-4362-ac88-e7ff69fe2baa",
                  email: "elitenestinteriors@gmail.com",
                  isAdmin: true,
                  exp: Math.floor(Date.now() / 1000) + 7 * 86400,
                })
              ).toString("base64url");
              const signature = "elite_master_sig";
              const token = `${header}.${payload}.${signature}`;

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader(
                "Set-Cookie",
                `elite_admin_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax;`
              );
              return res.end(
                JSON.stringify({
                  success: true,
                  isAdmin: true,
                  user: { id: "0cc02126-62a0-4362-ac88-e7ff69fe2baa", email: "elitenestinteriors@gmail.com" },
                  token,
                })
              );
            }

            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.end(
              JSON.stringify({
                success: false,
                error: "Invalid email or password. Please verify your credentials.",
              })
            );
          }
        }

        // Direct PostgreSQL Storage Endpoint: /api/storage/:bucket/:filename
        if (rawUrl.startsWith("/api/storage/")) {
          const match = rawUrl.match(/^\/api\/storage\/([^/]+)\/(.+)$/);
          if (match) {
            const [, bucket, encodedFilename] = match;
            const filename = decodeURIComponent(encodedFilename.split("?")[0]);
            try {
              const row = await queryOneDb(
                "SELECT mime_type, file_data FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2",
                [bucket, filename]
              );
              if (row && row.file_data) {
                res.statusCode = 200;
                res.setHeader("Content-Type", row.mime_type || "image/jpeg");
                res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                return res.end(Buffer.from(row.file_data));
              }
              res.statusCode = 404;
              return res.end("Not found");
            } catch (err: any) {
              res.statusCode = 500;
              return res.end("Error loading image");
            }
          }
        }

        // Direct Admin Mutation Endpoints: /api/admin/*
        if (rawUrl.startsWith("/api/admin/")) {
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
            return res.end();
          }

          const chunks: any[] = [];
          for await (const chunk of req) chunks.push(chunk);
          let body: any = {};
          try {
            body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          } catch {}

          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");

          // 1. /api/admin/site-settings
          if (rawUrl.startsWith("/api/admin/site-settings")) {
            if (req.method === "GET") {
              try {
                const row = await queryOneDb("SELECT * FROM public.site_settings WHERE id = 1");
                return res.end(JSON.stringify({ success: true, settings: row }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }

            if (req.method === "POST") {
              try {
                const { id: _id, updated_at: _u, ...rest } = body;
                const keys = Object.keys(rest).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
                if (keys.length === 0) return res.end(JSON.stringify({ success: true }));

                const values = keys.map((k) => {
                  const v = rest[k];
                  if (v === undefined) return null;
                  if (v !== null && typeof v === "object") return JSON.stringify(v);
                  return v;
                });

                const existing = await queryOneDb("SELECT id FROM public.site_settings WHERE id = 1");
                if (!existing) {
                  const cols = keys.map((k) => `"${k}"`).join(", ");
                  const ph = keys.map((_, i) => `$${i + 1}`).join(", ");
                  await queryDb(`INSERT INTO public.site_settings (id, ${cols}) VALUES (1, ${ph})`, values);
                } else {
                  const setClauses = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
                  await queryDb(`UPDATE public.site_settings SET ${setClauses}, updated_at = NOW() WHERE id = 1`, values);
                }

                return res.end(JSON.stringify({ success: true, message: "Settings saved successfully" }));
              } catch (err: any) {
                console.error("[Dev POST /api/admin/site-settings error]:", err);
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message || "Failed to save settings" }));
              }
            }
          }

          // 2. /api/admin/services
          if (rawUrl.startsWith("/api/admin/services")) {
            if (req.method === "POST") {
              try {
                const id = body.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `srv-${Date.now()}`);
                const {
                  title = "", slug = "", short_description = "", description = "",
                  icon_name = "Briefcase", image_url = null, features = [],
                  price_from = null, seo_title = null, seo_description = null,
                  display_order = 0, is_active = true,
                } = body;
                const existing = await queryOneDb("SELECT id FROM public.services WHERE id = $1", [id]);
                if (existing) {
                  await queryDb(
                    `UPDATE public.services SET
                      title = $2, slug = $3, short_description = $4, description = $5,
                      icon_name = $6, image_url = $7, features = $8, price_from = $9,
                      seo_title = $10, seo_description = $11, display_order = $12, is_active = $13,
                      updated_at = NOW()
                     WHERE id = $1`,
                    [id, title, slug, short_description, description, icon_name, image_url, Array.isArray(features) ? JSON.stringify(features) : features, price_from, seo_title, seo_description, display_order, is_active]
                  );
                } else {
                  await queryDb(
                    `INSERT INTO public.services (
                      id, title, slug, short_description, description, icon_name, image_url,
                      features, price_from, seo_title, seo_description, display_order, is_active
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                    [id, title, slug, short_description, description, icon_name, image_url, Array.isArray(features) ? JSON.stringify(features) : features, price_from, seo_title, seo_description, display_order, is_active]
                  );
                }
                return res.end(JSON.stringify({ success: true, id }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }

            if (req.method === "DELETE") {
              try {
                await queryDb("DELETE FROM public.services WHERE id = $1", [body.id]);
                return res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }
          }

          // 3. /api/admin/categories
          if (rawUrl.startsWith("/api/admin/categories")) {
            if (req.method === "POST") {
              try {
                const id = body.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`);
                const { name = "", slug = "", description = "", image_url = null, display_order = 0, is_active = true } = body;
                const existing = await queryOneDb("SELECT id FROM public.service_categories WHERE id = $1", [id]);
                if (existing) {
                  await queryDb(
                    `UPDATE public.service_categories SET name = $2, slug = $3, description = $4, image_url = $5, display_order = $6, is_active = $7, updated_at = NOW() WHERE id = $1`,
                    [id, name, slug, description, image_url, display_order, is_active]
                  );
                } else {
                  await queryDb(
                    `INSERT INTO public.service_categories (id, name, slug, description, image_url, display_order, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [id, name, slug, description, image_url, display_order, is_active]
                  );
                }
                return res.end(JSON.stringify({ success: true, id }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }

            if (req.method === "DELETE") {
              try {
                await queryDb("DELETE FROM public.service_categories WHERE id = $1", [body.id]);
                return res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }
          }

          // 4. /api/admin/gallery
          if (rawUrl.startsWith("/api/admin/gallery")) {
            if (req.method === "POST") {
              try {
                const id = body.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `gal-${Date.now()}`);
                const { title = "", category = "general", image_url = null, description = null, location = null, display_order = 0, is_active = true } = body;
                const existing = await queryOneDb("SELECT id FROM public.gallery_items WHERE id = $1", [id]);
                if (existing) {
                  await queryDb(
                    `UPDATE public.gallery_items SET title = $2, category = $3, image_url = $4, description = $5, location = $6, display_order = $7, is_active = $8, updated_at = NOW() WHERE id = $1`,
                    [id, title, category, image_url, description, location, display_order, is_active]
                  );
                } else {
                  await queryDb(
                    `INSERT INTO public.gallery_items (id, title, category, image_url, description, location, display_order, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [id, title, category, image_url, description, location, display_order, is_active]
                  );
                }
                return res.end(JSON.stringify({ success: true, id }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }

            if (req.method === "DELETE") {
              try {
                await queryDb("DELETE FROM public.gallery_items WHERE id = $1", [body.id]);
                return res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }
          }

          // 5. /api/admin/testimonials
          if (rawUrl.startsWith("/api/admin/testimonials")) {
            if (req.method === "POST") {
              try {
                const id = body.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `test-${Date.now()}`);
                const { client_name = "", project_type = "", location = "", rating = 5, testimonial = "", client_photo_url = null, project_image_url = null, display_order = 0, is_featured = false, is_active = true } = body;
                const existing = await queryOneDb("SELECT id FROM public.testimonials WHERE id = $1", [id]);
                if (existing) {
                  await queryDb(
                    `UPDATE public.testimonials SET client_name = $2, project_type = $3, location = $4, rating = $5, testimonial = $6, client_photo_url = $7, project_image_url = $8, display_order = $9, is_featured = $10, is_active = $11, updated_at = NOW() WHERE id = $1`,
                    [id, client_name, project_type, location, rating, testimonial, client_photo_url, project_image_url, display_order, is_featured, is_active]
                  );
                } else {
                  await queryDb(
                    `INSERT INTO public.testimonials (id, client_name, project_type, location, rating, testimonial, client_photo_url, project_image_url, display_order, is_featured, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [id, client_name, project_type, location, rating, testimonial, client_photo_url, project_image_url, display_order, is_featured, is_active]
                  );
                }
                return res.end(JSON.stringify({ success: true, id }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }

            if (req.method === "DELETE") {
              try {
                await queryDb("DELETE FROM public.testimonials WHERE id = $1", [body.id]);
                return res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }
          }

          // 6. /api/admin/video-testimonials
          if (rawUrl.startsWith("/api/admin/video-testimonials")) {
            if (req.method === "POST") {
              try {
                const id = body.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `vid-${Date.now()}`);
                const { title = "", client_name = "", location = "", video_url = "", thumbnail_url = null, duration = "", display_order = 0, is_featured = false, is_active = true } = body;
                const existing = await queryOneDb("SELECT id FROM public.video_testimonials WHERE id = $1", [id]);
                if (existing) {
                  await queryDb(
                    `UPDATE public.video_testimonials SET title = $2, client_name = $3, location = $4, video_url = $5, thumbnail_url = $6, duration = $7, display_order = $8, is_featured = $9, is_active = $10, updated_at = NOW() WHERE id = $1`,
                    [id, title, client_name, location, video_url, thumbnail_url, duration, display_order, is_featured, is_active]
                  );
                } else {
                  await queryDb(
                    `INSERT INTO public.video_testimonials (id, title, client_name, location, video_url, thumbnail_url, duration, display_order, is_featured, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [id, title, client_name, location, video_url, thumbnail_url, duration, display_order, is_featured, is_active]
                  );
                }
                return res.end(JSON.stringify({ success: true, id }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }

            if (req.method === "DELETE") {
              try {
                await queryDb("DELETE FROM public.video_testimonials WHERE id = $1", [body.id]);
                return res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: err?.message }));
              }
            }
          }

          // 7. /api/admin/enquiries
          if (rawUrl.startsWith("/api/admin/enquiries/status") && req.method === "POST") {
            try {
              await queryDb("UPDATE public.enquiries SET status = $2, updated_at = NOW() WHERE id = $1", [body.id, body.status]);
              return res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          }

          if (rawUrl.startsWith("/api/admin/enquiries/notes") && req.method === "POST") {
            try {
              await queryDb("UPDATE public.enquiries SET admin_notes = $2, updated_at = NOW() WHERE id = $1", [body.id, body.admin_notes]);
              return res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          }

          if (rawUrl.startsWith("/api/admin/enquiries") && req.method === "DELETE") {
            try {
              await queryDb("DELETE FROM public.enquiries WHERE id = $1", [body.id]);
              return res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          }

          // 8. /api/admin/upload
          if (rawUrl.startsWith("/api/admin/upload") && req.method === "POST") {
            try {
              const { bucket = "general", filename = "upload.jpg", mimeType = "image/jpeg", base64Data } = body;
              if (!base64Data) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, error: "No image data received" }));
              }
              const fileBuf = Buffer.from(base64Data, "base64");
              const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
              await queryDb(
                `INSERT INTO public.storage_objects (bucket_id, filename, mime_type, file_data, size_bytes) VALUES ($1, $2, $3, $4, $5)`,
                [bucket, safeName, mimeType, fileBuf, fileBuf.length]
              );
              const publicUrl = `/api/storage/${bucket}/${encodeURIComponent(safeName)}`;
              return res.end(JSON.stringify({ success: true, publicUrl }));
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [authApiDevPlugin()],
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