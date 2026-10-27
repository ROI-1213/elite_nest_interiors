import { createServerFn } from "@tanstack/react-start";
import { queryDb, queryOneDb } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "elite_nest_secret_key_2026_pg_auth";

/* ==================== AUTHENTICATION ==================== */

export const signInServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    try {
      const email = data?.email ? data.email.trim().toLowerCase() : "";
      if (!email || !data?.password) {
        throw new Error("Invalid email or password");
      }

      const user = await queryOneDb(
        "SELECT id, email, password_hash FROM public.users WHERE email = $1",
        [email]
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isValid = await bcrypt.compare(data.password, user.password_hash);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      // Check role
      const roleRow = await queryOneDb(
        "SELECT role FROM public.user_roles WHERE user_id = $1 AND role = 'admin'",
        [user.id]
      );

      const isAdmin = !!roleRow;
      const token = jwt.sign(
        { userId: user.id, email: user.email, isAdmin },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        user: { id: user.id, email: user.email },
        isAdmin,
        token,
      };
    } catch (err: any) {
      console.error("[signInServerFn error]:", err?.message || err);
      const msg = typeof err?.message === "string" ? err.message : "Authentication error";
      throw new Error(msg);
    }
  });

export const signUpServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const existing = await queryOneDb(
      "SELECT id FROM public.users WHERE email = $1",
      [email]
    );
    if (existing) {
      throw new Error("An account with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const newUser = await queryOneDb(
      "INSERT INTO public.users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );

    return {
      user: { id: newUser.id, email: newUser.email },
    };
  });

export const verifyTokenServerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token) return null;
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as {
        userId: string;
        email: string;
        isAdmin: boolean;
      };

      const roleRow = await queryOneDb(
        "SELECT role FROM public.user_roles WHERE user_id = $1 AND role = 'admin'",
        [decoded.userId]
      );

      return {
        user: { id: decoded.userId, email: decoded.email },
        isAdmin: !!roleRow,
      };
    } catch {
      return null;
    }
  });

export const checkIsAdminServerFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    if (!data.userId) return false;
    const roleRow = await queryOneDb(
      "SELECT role FROM public.user_roles WHERE user_id = $1 AND role = 'admin'",
      [data.userId]
    );
    return !!roleRow;
  });

/* ==================== SITE SETTINGS ==================== */

export const getSiteSettingsServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const settings = await queryOneDb(
      "SELECT * FROM public.site_settings WHERE id = 1"
    );
    if (!settings) {
      return {
        id: 1,
        business_name: "Elite Nest Interiors",
        tagline: "Crafting Timeless & Luxurious Interior Spaces",
      };
    }
    return settings;
  });

export const updateSiteSettingsServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    // Ensure newly added columns exist in PostgreSQL
    try {
      await queryDb("ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS featured_listings_cards TEXT;");
    } catch {
      // ignore
    }

    const fields = Object.keys(data).filter((k) => k !== "id" && k !== "updated_at");
    if (fields.length === 0) return { success: true };

    const existing = await queryOneDb("SELECT id FROM public.site_settings WHERE id = 1");
    if (!existing) {
      const cols = fields.map((f) => `"${f}"`).join(", ");
      const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
      const values = fields.map((f) => data[f]);
      await queryDb(`INSERT INTO public.site_settings (id, ${cols}) VALUES (1, ${placeholders})`, values);
    } else {
      const setClauses = fields.map((f, i) => `"${f}" = $${i + 1}`).join(", ");
      const values = fields.map((f) => data[f]);
      await queryDb(
        `UPDATE public.site_settings SET ${setClauses}, updated_at = NOW() WHERE id = 1`,
        values
      );
    }

    return { success: true };
  });

/* ==================== CATEGORIES ==================== */

export const getCategoriesServerFn = createServerFn({ method: "POST" })
  .validator((data: { onlyActive?: boolean }) => data)
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM public.service_categories";
    const params: any[] = [];
    if (data.onlyActive ?? true) {
      sql += " WHERE is_active = true";
    }
    sql += " ORDER BY display_order ASC, created_at DESC";
    return await queryDb(sql, params);
  });

export const saveCategoryServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    if (data.id) {
      await queryDb(
        `UPDATE public.service_categories SET
          name = $1, slug = $2, description = $3, image_url = $4, display_order = $5, is_active = $6, updated_at = NOW()
         WHERE id = $7`,
        [
          data.name,
          data.slug,
          data.description ?? null,
          data.image_url ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
          data.id,
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO public.service_categories (name, slug, description, image_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          data.name,
          data.slug,
          data.description ?? null,
          data.image_url ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
        ]
      );
    }
    return { success: true };
  });

export const deleteCategoryServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("DELETE FROM public.service_categories WHERE id = $1", [data.id]);
    return { success: true };
  });

/* ==================== SERVICES ==================== */

export const getServicesServerFn = createServerFn({ method: "POST" })
  .validator((data: { onlyActive?: boolean }) => data)
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM public.services";
    if (data.onlyActive ?? true) {
      sql += " WHERE is_active = true";
    }
    sql += " ORDER BY display_order ASC, created_at DESC";
    const rows = await queryDb(sql);
    return rows.map((s) => ({
      ...s,
      gallery: Array.isArray(s.gallery) ? s.gallery : [],
      features: Array.isArray(s.features) ? s.features : [],
    }));
  });

export const getServiceBySlugServerFn = createServerFn({ method: "POST" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const s = await queryOneDb(
      "SELECT * FROM public.services WHERE slug = $1 AND is_active = true",
      [data.slug]
    );
    if (!s) return null;
    return {
      ...s,
      gallery: Array.isArray(s.gallery) ? s.gallery : [],
      features: Array.isArray(s.features) ? s.features : [],
    };
  });

export const saveServiceServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    const featuresJson = JSON.stringify(data.features || []);
    const galleryJson = JSON.stringify(data.gallery || []);

    if (data.id) {
      await queryDb(
        `UPDATE public.services SET
          category_id = $1, title = $2, slug = $3, short_description = $4, description = $5,
          image_url = $6, price_from = $7, features = $8::jsonb, gallery = $9::jsonb,
          seo_title = $10, seo_description = $11, display_order = $12, is_active = $13, updated_at = NOW()
         WHERE id = $14`,
        [
          data.category_id || null,
          data.title,
          data.slug,
          data.short_description ?? null,
          data.description ?? null,
          data.image_url ?? null,
          data.price_from ?? null,
          featuresJson,
          galleryJson,
          data.seo_title ?? null,
          data.seo_description ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
          data.id,
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO public.services (
          category_id, title, slug, short_description, description, image_url, price_from,
          features, gallery, seo_title, seo_description, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11, $12, $13)`,
        [
          data.category_id || null,
          data.title,
          data.slug,
          data.short_description ?? null,
          data.description ?? null,
          data.image_url ?? null,
          data.price_from ?? null,
          featuresJson,
          galleryJson,
          data.seo_title ?? null,
          data.seo_description ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
        ]
      );
    }
    return { success: true };
  });

export const deleteServiceServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("DELETE FROM public.services WHERE id = $1", [data.id]);
    return { success: true };
  });

/* ==================== GALLERY ITEMS ==================== */

export const getGalleryItemsServerFn = createServerFn({ method: "POST" })
  .validator((data: { onlyActive?: boolean }) => data)
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM public.gallery_items";
    if (data.onlyActive ?? true) {
      sql += " WHERE is_active = true";
    }
    sql += " ORDER BY display_order ASC, created_at DESC";
    return await queryDb(sql);
  });

export const saveGalleryItemServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    if (data.id) {
      await queryDb(
        `UPDATE public.gallery_items SET
          title = $1, category = $2, image_url = $3, description = $4, display_order = $5, is_active = $6, location = $7, updated_at = NOW()
         WHERE id = $8`,
        [
          data.title,
          data.category ?? null,
          data.image_url,
          data.description ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
          data.location ?? null,
          data.id,
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO public.gallery_items (title, category, image_url, description, display_order, is_active, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          data.title,
          data.category ?? null,
          data.image_url,
          data.description ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
          data.location ?? null,
        ]
      );
    }
    return { success: true };
  });

export const deleteGalleryItemServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("DELETE FROM public.gallery_items WHERE id = $1", [data.id]);
    return { success: true };
  });

export const upsertGalleryItemsServerFn = createServerFn({ method: "POST" })
  .validator((data: { items: any[] }) => data)
  .handler(async ({ data }) => {
    for (const item of data.items) {
      await saveGalleryItemServerFn({ data: item });
    }
    return { success: true };
  });

/* ==================== TESTIMONIALS ==================== */

export const getTestimonialsServerFn = createServerFn({ method: "POST" })
  .validator((data: { onlyActive?: boolean }) => data)
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM public.testimonials";
    if (data.onlyActive ?? true) {
      sql += " WHERE is_active = true";
    }
    sql += " ORDER BY display_order ASC, created_at DESC";
    return await queryDb(sql);
  });

export const saveTestimonialServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    if (data.id) {
      await queryDb(
        `UPDATE public.testimonials SET
          author_name = $1, author_location = $2, author_avatar_url = $3, rating = $4,
          content = $5, service_type = $6, project_image_url = $7, display_order = $8, is_active = $9, updated_at = NOW()
         WHERE id = $10`,
        [
          data.author_name,
          data.author_location ?? null,
          data.author_avatar_url ?? null,
          data.rating ?? 5,
          data.content,
          data.service_type ?? null,
          data.project_image_url ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
          data.id,
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO public.testimonials (author_name, author_location, author_avatar_url, rating, content, service_type, project_image_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          data.author_name,
          data.author_location ?? null,
          data.author_avatar_url ?? null,
          data.rating ?? 5,
          data.content,
          data.service_type ?? null,
          data.project_image_url ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
        ]
      );
    }
    return { success: true };
  });

export const deleteTestimonialServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("DELETE FROM public.testimonials WHERE id = $1", [data.id]);
    return { success: true };
  });

/* ==================== VIDEO TESTIMONIALS ==================== */

export const getVideoTestimonialsServerFn = createServerFn({ method: "POST" })
  .validator((data: { onlyActive?: boolean }) => data)
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM public.video_testimonials";
    if (data.onlyActive ?? true) {
      sql += " WHERE is_active = true";
    }
    sql += " ORDER BY display_order ASC, created_at DESC";
    return await queryDb(sql);
  });

export const saveVideoTestimonialServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    if (data.id) {
      await queryDb(
        `UPDATE public.video_testimonials SET
          title = $1, author_name = $2, video_url = $3, thumbnail_url = $4, display_order = $5, is_active = $6, updated_at = NOW()
         WHERE id = $7`,
        [
          data.title,
          data.author_name ?? null,
          data.video_url,
          data.thumbnail_url ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
          data.id,
        ]
      );
    } else {
      await queryDb(
        `INSERT INTO public.video_testimonials (title, author_name, video_url, thumbnail_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          data.title,
          data.author_name ?? null,
          data.video_url,
          data.thumbnail_url ?? null,
          data.display_order ?? 0,
          data.is_active ?? true,
        ]
      );
    }
    return { success: true };
  });

export const deleteVideoTestimonialServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("DELETE FROM public.video_testimonials WHERE id = $1", [data.id]);
    return { success: true };
  });

/* ==================== ENQUIRIES ==================== */

export const getEnquiriesServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return await queryDb("SELECT * FROM public.enquiries ORDER BY created_at DESC");
  });

export const submitEnquiryServerFn = createServerFn({ method: "POST" })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    await queryDb(
      `INSERT INTO public.enquiries (name, phone, email, message, service_id, service_title, source, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')`,
      [
        data.name,
        data.phone,
        data.email ?? null,
        data.message ?? null,
        data.service_id ?? null,
        data.service_title ?? null,
        data.source ?? "website",
      ]
    );
    return { success: true };
  });

export const updateEnquiryStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("UPDATE public.enquiries SET status = $1::enquiry_status, updated_at = NOW() WHERE id = $2", [
      data.status,
      data.id,
    ]);
    return { success: true };
  });

export const updateEnquiryNotesServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; admin_notes: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("UPDATE public.enquiries SET admin_notes = $1, updated_at = NOW() WHERE id = $2", [
      data.admin_notes,
      data.id,
    ]);
    return { success: true };
  });

export const deleteEnquiryServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await queryDb("DELETE FROM public.enquiries WHERE id = $1", [data.id]);
    return { success: true };
  });

/* ==================== STORAGE BUCKETS IN POSTGRESQL ==================== */

export const uploadStorageFileServerFn = createServerFn({ method: "POST" })
  .validator((data: { bucket: string; filename: string; mimeType: string; base64Data: string }) => data)
  .handler(async ({ data }) => {
    // Ensure bucket exists in storage_buckets table
    await queryDb(
      `INSERT INTO public.storage_buckets (id, name, public)
       VALUES ($1, $1, true)
       ON CONFLICT (id) DO NOTHING`,
      [data.bucket]
    );

    const buffer = Buffer.from(data.base64Data, "base64");
    await queryDb(
      `INSERT INTO public.storage_objects (bucket_id, filename, mime_type, file_data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (bucket_id, filename)
       DO UPDATE SET mime_type = EXCLUDED.mime_type, file_data = EXCLUDED.file_data, created_at = NOW()`,
      [data.bucket, data.filename, data.mimeType, buffer]
    );

    // Return the PostgreSQL storage endpoint URL
    return {
      publicUrl: `/api/storage/${data.bucket}/${encodeURIComponent(data.filename)}`,
    };
  });
