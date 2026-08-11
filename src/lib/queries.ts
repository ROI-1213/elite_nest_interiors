import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SERVICE_ORDER, SERVICE_SLUGS, SERVICE_DESCRIPTIONS, SERVICE_IMAGES } from "@/lib/services.config";
import {
  getCategoriesServerFn,
  getServicesServerFn,
  getServiceBySlugServerFn,
  getGalleryItemsServerFn,
  getTestimonialsServerFn,
  getVideoTestimonialsServerFn,
  getSiteSettingsServerFn,
  getEnquiriesServerFn,
} from "@/lib/server-functions";
import { SITE_SETTINGS_DEFAULTS, PLACEHOLDER_TESTIMONIALS } from "@/lib/site-content";
import { CURATED_GALLERY } from "@/lib/gallery.config";

type SupabaseReadError = { code?: string; message?: string; details?: string };

function isRecoverableContentReadError(error: SupabaseReadError | null | unknown): boolean {
  if (!error) return false;
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
  console.warn("[content] Using fallback data:", (error as Error)?.message ?? error);
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
  updated_at: string;
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
  about_hero_title?: string | null;
  about_hero_subtitle?: string | null;
  about_positioning?: string | null;
  vision_title: string | null;
  vision_content: string | null;
  mission_title?: string | null;
  mission_content: string | null;
  footer_about: string | null;
  footer_copyright: string | null;
  hero_eyebrow?: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_cta_label: string | null;
  cta_title: string | null;
  cta_subtitle: string | null;
  why_us_title?: string | null;
  traditional_firm_title?: string | null;
  elitenest_title?: string | null;
  traditional_firm_points?: string | null;
  elitenest_points?: string | null;
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

const DEFAULT_SERVICES: Service[] = SERVICE_ORDER.map((name, idx) => ({
  id: `svc-${idx + 1}`,
  category_id: null,
  title: name,
  slug: SERVICE_SLUGS[name],
  short_description: SERVICE_DESCRIPTIONS[name],
  description: `${SERVICE_DESCRIPTIONS[name]} Comprehensive planning, custom design execution, premium material selection, and single-point project accountability for homes and businesses across Bengaluru.`,
  image_url: SERVICE_IMAGES[name],
  gallery: [SERVICE_IMAGES[name]],
  features: [
    "Single point of contact & single-contract accountability",
    "3D visualization & detailed material specs",
    "On-time execution with milestone tracking",
    "Transparent pricing with no hidden costs",
  ],
  price_from: 150000,
  seo_title: `${name} | Elite Nest Interiors Bengaluru`,
  seo_description: SERVICE_DESCRIPTIONS[name],
  display_order: idx + 1,
  is_active: true,
}));

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Bedroom", slug: "bedroom", description: "Calm and elegant bedroom interiors designed for comfort.", image_url: null, display_order: 1, is_active: true },
  { id: "cat-2", name: "Kitchen", slug: "kitchen", description: "Smart modular kitchens with premium hardware and storage.", image_url: null, display_order: 2, is_active: true },
  { id: "cat-3", name: "Living", slug: "living", description: "Sophisticated living spaces crafted for warmth and luxury.", image_url: null, display_order: 3, is_active: true },
  { id: "cat-4", name: "Dining", slug: "dining", description: "Refined dining spaces designed for family gatherings.", image_url: null, display_order: 4, is_active: true },
  { id: "cat-5", name: "Wardrobe", slug: "wardrobe", description: "Custom modular storage solutions tailored to your space.", image_url: null, display_order: 5, is_active: true },
  { id: "cat-6", name: "Foyer", slug: "foyer", description: "Welcoming entrance foyers that create an elegant first impression.", image_url: null, display_order: 6, is_active: true },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  business_name: SITE_SETTINGS_DEFAULTS.business_name ?? "Elite Nest Interiors",
  tagline: SITE_SETTINGS_DEFAULTS.tagline ?? "Crafting Timeless & Luxurious Interior Spaces",
  phone: SITE_SETTINGS_DEFAULTS.phone ?? "+91 93640 48269",
  whatsapp: SITE_SETTINGS_DEFAULTS.whatsapp ?? "+91 93640 48269",
  email: SITE_SETTINGS_DEFAULTS.email ?? "contact@elitenestinteriors.com",
  address: SITE_SETTINGS_DEFAULTS.address ?? "No. 42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
  google_map_url: SITE_SETTINGS_DEFAULTS.google_map_url ?? "https://www.google.com/maps",
  business_hours: SITE_SETTINGS_DEFAULTS.business_hours ?? "Mon–Sat · 10am – 7pm",
  facebook_url: null,
  instagram_url: SITE_SETTINGS_DEFAULTS.instagram_url ?? null,
  youtube_url: SITE_SETTINGS_DEFAULTS.youtube_url ?? null,
  linkedin_url: SITE_SETTINGS_DEFAULTS.linkedin_url ?? null,
  twitter_url: null,
  pinterest_url: null,
  hero_eyebrow: SITE_SETTINGS_DEFAULTS.hero_eyebrow ?? "Crafting Spaces",
  hero_title: SITE_SETTINGS_DEFAULTS.hero_title ?? "Where Design Meets\nTimeless Living",
  hero_subtitle: SITE_SETTINGS_DEFAULTS.hero_subtitle ?? "Beautiful interiors. Thoughtful design. Perfectly executed.",
  hero_image_url: null,
  hero_cta_label: SITE_SETTINGS_DEFAULTS.hero_cta_label ?? "Explore Our Work",
  cta_title: SITE_SETTINGS_DEFAULTS.cta_title ?? "Looking For Expert Guidance To Design Your Dream Space?",
  cta_subtitle: SITE_SETTINGS_DEFAULTS.cta_subtitle ?? "Share your requirements and our interior design team will help you plan a beautiful, functional, and personalized space.",
  why_us_title: SITE_SETTINGS_DEFAULTS.why_us_title ?? "Why choose the elitenest",
  traditional_firm_title: SITE_SETTINGS_DEFAULTS.traditional_firm_title ?? "Traditional firm",
  traditional_firm_points: SITE_SETTINGS_DEFAULTS.traditional_firm_points ?? "",
  elitenest_title: SITE_SETTINGS_DEFAULTS.elitenest_title ?? "Elite Nest",
  elitenest_points: SITE_SETTINGS_DEFAULTS.elitenest_points ?? "",
  about_title: SITE_SETTINGS_DEFAULTS.about_title ?? "About Elite Nest Interiors",
  about_content: SITE_SETTINGS_DEFAULTS.about_content ?? "Elite Nest Interiors is a premier interior architecture studio specializing in high-end residential and commercial projects.",
  about_image_url: null,
  about_hero_title: SITE_SETTINGS_DEFAULTS.about_hero_title ?? "Design That Performs\nBeyond Appearance.",
  about_hero_subtitle: SITE_SETTINGS_DEFAULTS.about_hero_subtitle ?? "We create spaces that are functional, durable, aesthetically refined, and intelligently planned.",
  about_positioning: SITE_SETTINGS_DEFAULTS.about_positioning ?? "World-Class Interiors.\nThoughtfully Built.",
  vision_title: SITE_SETTINGS_DEFAULTS.vision_title ?? "Our Vision",
  vision_content: SITE_SETTINGS_DEFAULTS.vision_content ?? "To redefine luxury living through innovative, elegant, and functional design solutions.",
  mission_title: SITE_SETTINGS_DEFAULTS.mission_title ?? "Our Mission",
  mission_content: SITE_SETTINGS_DEFAULTS.mission_content ?? "To deliver unparalleled craftsmanship, meticulous attention to detail, and exceptional customer experience.",
  footer_about: SITE_SETTINGS_DEFAULTS.footer_about ?? "End-to-end construction, architecture and interior solutions.",
  footer_copyright: SITE_SETTINGS_DEFAULTS.footer_copyright ?? "© 2026 Elite Nest Interiors. All rights reserved.",
};

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = CURATED_GALLERY.map((c, i) => ({
  id: c.id,
  title: c.title,
  category: c.category,
  image_url: `asset://${c.assetKey}`,
  description: c.description,
  display_order: i + 1,
  is_active: true,
}));

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings> => {
    try {
      const data = await getSiteSettingsServerFn();
      if (!data) return DEFAULT_SITE_SETTINGS;

      const merged = { ...DEFAULT_SITE_SETTINGS };
      for (const k of Object.keys(DEFAULT_SITE_SETTINGS) as Array<keyof SiteSettings>) {
        if (data[k] !== null && data[k] !== undefined && data[k] !== "") {
          (merged as any)[k] = data[k];
        }
      }
      return merged;
    } catch (err) {
      return DEFAULT_SITE_SETTINGS;
    }
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
        const data = await getCategoriesServerFn({ data: { onlyActive: opts.onlyActive } });
        if (!data || data.length === 0) return DEFAULT_CATEGORIES;
        return data as Category[];
      } catch (err) { return DEFAULT_CATEGORIES; }
    },
  });

export const servicesQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["services", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Service[]> => {
      try {
        const data = await getServicesServerFn({ data: { onlyActive: opts.onlyActive } });
        if (!data || data.length === 0) return DEFAULT_SERVICES;
        return data.map((s: any) => ({
          ...s,
          gallery: Array.isArray(s.gallery) ? s.gallery : [],
          features: Array.isArray(s.features) ? s.features : [],
        })) as Service[];
      } catch (err) { return DEFAULT_SERVICES; }
    },
  });

export const serviceBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Service | null> => {
      try {
        const data = await getServiceBySlugServerFn({ data: { slug } });
        if (!data) {
          const match = DEFAULT_SERVICES.find((s) => s.slug === slug);
          return match || null;
        }
        return {
          ...data,
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          features: Array.isArray(data.features) ? data.features : [],
        } as Service;
      } catch (err) {
        return DEFAULT_SERVICES.find((s) => s.slug === slug) || null;
      }
    },
  });

export const enquiriesQuery = () =>
  queryOptions({
    queryKey: ["enquiries"],
    staleTime: 30_000,
    queryFn: async (): Promise<Enquiry[]> => {
      try {
        const data = await getEnquiriesServerFn();
        return (data ?? []) as Enquiry[];
      } catch (err) { return []; }
    },
  });

export const testimonialsQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["testimonials", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<Testimonial[]> => {
      try {
        const data = await getTestimonialsServerFn({ data: { onlyActive: opts.onlyActive } });
        if (!data || data.length === 0) return PLACEHOLDER_TESTIMONIALS;
        return data as Testimonial[];
      } catch (err) { return PLACEHOLDER_TESTIMONIALS; }
    },
  });

export const videoTestimonialsQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["video_testimonials", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<VideoTestimonial[]> => {
      try {
        const data = await getVideoTestimonialsServerFn({ data: { onlyActive: opts.onlyActive } });
        if (!data) return [];
        return data as VideoTestimonial[];
      } catch (err) { return []; }
    },
  });

export const galleryQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["gallery_items", opts.onlyActive ?? true],
    staleTime: 15 * 60_000,
    retry: 1,
    queryFn: async (): Promise<GalleryItem[]> => {
      try {
        const data = await getGalleryItemsServerFn({ data: { onlyActive: opts.onlyActive } });
        if (!data || data.length === 0) return DEFAULT_GALLERY_ITEMS;
        return data as GalleryItem[];
      } catch (err) { return DEFAULT_GALLERY_ITEMS; }
    },
  });

