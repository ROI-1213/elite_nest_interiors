import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SupabaseReadError = { code?: string; message?: string; details?: string };

function isRecoverableContentReadError(error: SupabaseReadError | null | unknown): boolean {
  if (!error) return false;
  // Network-level failures (Supabase project paused / no internet)
  if (error instanceof TypeError) return true;
  const e = error as SupabaseReadError;
  const text = `${e.code ?? ""} ${e.message ?? ""} ${e.details ?? ""}`.toLowerCase();
  return (
    text.includes("pgrst205") ||
    text.includes("42p01") ||
    text.includes("42501") ||
    text.includes("could not find the table") ||
    text.includes("does not exist") ||
    text.includes("permission denied") ||
    text.includes("fetch failed") ||
    text.includes("failed to fetch") ||
    text.includes("enotfound") ||
    text.includes("networkerror") ||
    text.includes("network request failed")
  );
}

function fallbackOnMissingContent<T>(error: SupabaseReadError | null | unknown, fallback: T): T {
  console.warn("[content] Using fallback data — Supabase unavailable or content not ready:", (error as Error)?.message ?? error);
  return fallback;
}

export type Service = {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[];
  features: string[];
  price_from: number | null;
  seo_title: string | null;
  seo_description: string | null;
  display_order: number;
  is_active: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_location: string | null;
  author_avatar_url: string | null;
  rating: number;
  content: string;
  service_type: string | null;
  project_image_url: string | null;
  display_order: number;
  is_active: boolean;
};


export type VideoTestimonial = {
  id: string;
  title: string;
  author_name: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
};

export type SiteSettings = {
  id: number;
  business_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  google_map_url: string | null;
  business_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  pinterest_url: string | null;
  about_title: string | null;
  about_content: string | null;
  about_image_url: string | null;
  vision_title: string | null;
  vision_content: string | null;
  mission_content: string | null;
  footer_about: string | null;
  footer_copyright: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_cta_label: string | null;
  cta_title: string | null;
  cta_subtitle: string | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  image_url: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export const galleryQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["gallery_items", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<GalleryItem[]> => {
      try {
        let q = supabase.from("gallery_items").select("*").order("display_order");
        if (opts.onlyActive ?? true) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error) return fallbackOnMissingContent(error, []);
        return (data ?? []) as GalleryItem[];
      } catch (err) { return fallbackOnMissingContent(err, []); }
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings> => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) return fallbackOnMissingContent(error, { id: 1, business_name: "Elite Nest Interiors" } as SiteSettings);
      return (data ?? { id: 1, business_name: "Elite Nest Interior" }) as SiteSettings;
    } catch (err) { return fallbackOnMissingContent(err, { id: 1, business_name: "Elite Nest Interiors" } as SiteSettings); }
  },
  staleTime: 15 * 60_000,
  retry: 1,
});

export const categoriesQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["service_categories", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Category[]> => {
      try {
        let q = supabase.from("service_categories").select("*").order("display_order");
        if (opts.onlyActive ?? true) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error) return fallbackOnMissingContent(error, []);
        return (data ?? []) as Category[];
      } catch (err) { return fallbackOnMissingContent(err, []); }
    },
  });

export const servicesQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["services", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Service[]> => {
      try {
        let q = supabase.from("services").select("*").order("display_order");
        if (opts.onlyActive ?? true) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error) return fallbackOnMissingContent(error, []);
        return (data ?? []).map((s) => ({
          ...s,
          gallery: Array.isArray(s.gallery) ? (s.gallery as string[]) : [],
          features: Array.isArray(s.features) ? (s.features as string[]) : [],
        })) as Service[];
      } catch (err) { return fallbackOnMissingContent(err, []); }
    },
  });

export const serviceBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Service | null> => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();
        if (error) return fallbackOnMissingContent(error, null);
        if (!data) return null;
        return {
          ...data,
          gallery: Array.isArray(data.gallery) ? (data.gallery as string[]) : [],
          features: Array.isArray(data.features) ? (data.features as string[]) : [],
        } as Service;
      } catch (err) { return fallbackOnMissingContent(err, null); }
    },
  });

export const testimonialsQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["testimonials", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Testimonial[]> => {
      try {
        let q = supabase.from("testimonials").select("*").order("display_order");
        if (opts.onlyActive ?? true) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error) return fallbackOnMissingContent(error, []);
        return (data ?? []) as Testimonial[];
      } catch (err) { return fallbackOnMissingContent(err, []); }
    },
  });

export const videoTestimonialsQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["video_testimonials", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<VideoTestimonial[]> => {
      try {
        let q = supabase.from("video_testimonials").select("*").order("display_order");
        if (opts.onlyActive ?? true) q = q.eq("is_active", true);
        const { data, error } = await q;
        if (error) return fallbackOnMissingContent(error, []);
        return (data ?? []) as VideoTestimonial[];
      } catch (err) { return fallbackOnMissingContent(err, []); }
    },
  });

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  service_id: string | null;
  service_title: string | null;
  source: string | null;
  status: "new" | "contacted" | "in_progress" | "won" | "lost";
  admin_notes: string | null;
  created_at: string;
};

export const enquiriesQuery = queryOptions({
  queryKey: ["enquiries"],
  queryFn: async (): Promise<Enquiry[]> => {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return fallbackOnMissingContent(error, []);
      return (data ?? []) as Enquiry[];
    } catch (err) { return fallbackOnMissingContent(err, []); }
  },
});
