import { queryOptions } from "@tanstack/react-query";
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

type DatabaseReadError = { code?: string; message?: string; details?: string };

function isRecoverableContentReadError(error: DatabaseReadError | null | unknown): boolean {
  if (!error) return false;
  if (error instanceof TypeError) return true;
  const e = error as DatabaseReadError;
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

function fallbackOnMissingContent<T>(error: DatabaseReadError | null | unknown, fallback: T): T {
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
  process_eyebrow?: string | null;
  process_title?: string | null;
  process_step1_title?: string | null;
  process_step1_desc?: string | null;
  process_step2_title?: string | null;
  process_step2_desc?: string | null;
  process_step3_title?: string | null;
  process_step3_desc?: string | null;
  process_step4_title?: string | null;
  process_step4_desc?: string | null;
  process_step5_title?: string | null;
  process_step5_desc?: string | null;
  services_section_title?: string | null;
  services_section_subtitle?: string | null;
  categories_section_title?: string | null;
  categories_section_subtitle?: string | null;
  categories_section_eyebrow?: string | null;
  e2e_eyebrow?: string | null;
  e2e_title?: string | null;
  services_offer_title?: string | null;
  services_offer_subtitle?: string | null;
  featured_listings_eyebrow?: string | null;
  featured_listings_title?: string | null;
  featured_listings_subtitle?: string | null;
  accordion_section_eyebrow?: string | null;
  accordion_section_title?: string | null;
  accordion_section_subtitle?: string | null;
  testimonials_eyebrow?: string | null;
  testimonials_title?: string | null;
  video_section_eyebrow?: string | null;
  video_section_title?: string | null;
  about_hero_eyebrow?: string | null;
  about_why_eyebrow?: string | null;
  about_why_title?: string | null;
  about_why_content?: string | null;
  about_philosophy_eyebrow?: string | null;
  about_philosophy_title?: string | null;
  about_philosophy_subtitle?: string | null;
  about_phil1_title?: string | null;
  about_phil1_desc?: string | null;
  about_phil2_title?: string | null;
  about_phil2_desc?: string | null;
  about_phil3_title?: string | null;
  about_phil3_desc?: string | null;
  about_phil4_title?: string | null;
  about_phil4_desc?: string | null;
  about_phil5_title?: string | null;
  about_phil5_desc?: string | null;
  about_phil6_title?: string | null;
  about_phil6_desc?: string | null;
  about_diff_eyebrow?: string | null;
  about_diff_title?: string | null;
  about_diff_trad_title?: string | null;
  about_diff_trad_subtitle?: string | null;
  about_diff_trad_points?: string | null;
  about_diff_elite_title?: string | null;
  about_diff_elite_subtitle?: string | null;
  about_diff_elite_points?: string | null;
  about_spaces_eyebrow?: string | null;
  about_spaces_title?: string | null;
  about_spaces_desc?: string | null;
  about_mat_eyebrow?: string | null;
  about_mat_title?: string | null;
  about_mat_desc?: string | null;
  about_mat1_title?: string | null;
  about_mat1_desc?: string | null;
  about_mat2_title?: string | null;
  about_mat2_desc?: string | null;
  about_mat3_title?: string | null;
  about_mat3_desc?: string | null;
  about_mat4_title?: string | null;
  about_mat4_desc?: string | null;
  about_mat5_title?: string | null;
  about_mat5_desc?: string | null;
  about_mat6_title?: string | null;
  about_mat6_desc?: string | null;
  about_trust_eyebrow?: string | null;
  about_trust_title?: string | null;
  about_stat1_val?: string | null;
  about_stat1_label?: string | null;
  about_stat2_val?: string | null;
  about_stat2_label?: string | null;
  about_stat3_val?: string | null;
  about_stat3_label?: string | null;
  about_stat4_val?: string | null;
  about_stat4_label?: string | null;
  about_trust_points?: string | null;
  about_cta_eyebrow?: string | null;
  about_cta_title?: string | null;
  about_cta_desc?: string | null;
  about_cta_button?: string | null;
  gallery_hero_title?: string | null;
  gallery_hero_subtitle?: string | null;
  gallery_hero_image_url?: string | null;
  gallery_featured_eyebrow?: string | null;
  gallery_grid_eyebrow?: string | null;
  gallery_grid_title?: string | null;
  gallery_video_eyebrow?: string | null;
  gallery_video_title?: string | null;
  gallery_cta_title?: string | null;
  gallery_cta_subtitle?: string | null;
  gallery_cta_btn1?: string | null;
  gallery_cta_btn2?: string | null;
  contact_hero_eyebrow?: string | null;
  contact_hero_title?: string | null;
  contact_hero_subtitle?: string | null;
  contact_hero_image_url?: string | null;
  contact_hero_cta1?: string | null;
  contact_hero_cta2?: string | null;
  contact_stat1_val?: string | null;
  contact_stat1_label?: string | null;
  contact_stat2_val?: string | null;
  contact_stat2_label?: string | null;
  contact_stat3_val?: string | null;
  contact_stat3_label?: string | null;
  contact_enquiry_eyebrow?: string | null;
  contact_enquiry_title?: string | null;
  contact_enquiry_subtitle?: string | null;
  contact_guarantee1?: string | null;
  contact_guarantee2?: string | null;
  contact_guarantee3?: string | null;
  contact_map_eyebrow?: string | null;
  contact_map_title?: string | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  image_url: string;
  description: string | null;
  location?: string | null;
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
  google_map_url: SITE_SETTINGS_DEFAULTS.google_map_url ?? "https://maps.app.goo.gl/9W8aWwyw2Rfq5vCfA?g_st=iw",
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
  e2e_eyebrow: "What we offer",
  e2e_title: "Our End-to-End Home Interior Design Services In Bangalore",
  services_offer_title: "Services We Offer",
  services_offer_subtitle: "From initial concept sketches to turnkey handover, we offer specialized architectural & interior design solutions tailored to your unique requirements.",
  categories_section_eyebrow: "Our Interior Expertise",
  categories_section_title: "Spaces Designed Around Your Lifestyle",
  categories_section_subtitle: "Explore our curated interior solutions for every corner of your home.",
  featured_listings_eyebrow: "Featured Service Listings",
  featured_listings_title: "Featured Listings",
  featured_listings_subtitle: "Explore our curated work across interiors, construction, supervision, and design execution.",
  accordion_section_eyebrow: "Our Services",
  accordion_section_title: "Crafting Bengaluru Spaces With Design, Precision & Execution",
  accordion_section_subtitle: "Explore our premium architecture, construction, supervision, and interior design services tailored for modern Bengaluru living and working spaces.",
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
  video_section_eyebrow: "Hear it firsthand",
  video_section_title: "Video testimonials",
  about_hero_eyebrow: "ABOUT — ELITE NEST INTERIORS",
  about_why_eyebrow: "Why we exist",
  about_why_title: "A function-first interior company.",
  about_why_content: "Elite Nest Architects & Interiors is a premier design and execution firm dedicated to creating elegant, functional, and inspiring spaces. We specialize in residential, commercial, and turnkey interior solutions that reflect our clients’ lifestyle, vision, and aspirations.\n\nWith a passion for innovation and attention to detail, we transform ordinary spaces into extraordinary environments through thoughtful planning, modern design concepts, and high-quality craftsmanship.",
  about_philosophy_eyebrow: "Philosophy",
  about_philosophy_title: "Good design should work hard.",
  about_philosophy_subtitle: "Smart design works better than simply attractive design. Every decision is guided by usability, storage efficiency, hygiene, workflow, ease of cleaning and structural integrity.",
  about_phil1_title: "Function Before Decoration",
  about_phil1_desc: "Every element earns its place through daily usefulness — not just visual appeal.",
  about_phil2_title: "Timeless Over Trendy",
  about_phil2_desc: "We design for a decade of relevance, not a season of applause.",
  about_phil3_title: "Smart Cost Optimization",
  about_phil3_desc: "Premium where it matters, disciplined everywhere else.",
  about_phil4_title: "Precision in Execution",
  about_phil4_desc: "Millimetre-level detailing, dimensionally accurate joinery, consistent finishes.",
  about_phil5_title: "Durability Matters",
  about_phil5_desc: "Materials and construction chosen to withstand real, everyday use.",
  about_phil6_title: "Maintenance-Friendly",
  about_phil6_desc: "Surfaces, hardware, and layouts that are easy to clean, service, and live with.",
  about_diff_eyebrow: "The difference",
  about_diff_title: "Traditional interior firms vs. the Elite Nest approach.",
  about_diff_trad_title: "Traditional firms",
  about_diff_trad_subtitle: "Where projects usually fail",
  about_diff_trad_points: "Beautiful designs that lack practicality\nHidden costs and budget overruns\nMultiple vendors, multiple headaches\nDelays and inconsistent execution\nNo clear ownership or accountability\nSpaces designed for looks, not everyday living",
  about_diff_elite_title: "Elite Nest",
  about_diff_elite_subtitle: "How we deliver differently",
  about_diff_elite_points: "Function-led designs with timeless aesthetics\nTransparent budgets with no hidden surprises\nSingle-point accountability from start to finish\nStructured execution with on-time delivery\nSmart sourcing for quality and value\nSpaces crafted for real-life comfort and performance",
  about_spaces_eyebrow: "Spaces we build",
  about_spaces_title: "Transforming Residential & Commercial Spaces",
  about_spaces_desc: "From residences to commercial spaces, Elite Nest delivers end-to-end interior solutions—from concept and design to execution and handover, ensuring a seamless experience at every stage.",
  about_mat_eyebrow: "Material & build",
  about_mat_title: "Intelligent materials. Honest craftsmanship.",
  about_mat_desc: "We invest in premium materials where they change daily experience, and optimize elsewhere to protect your budget without compromising longevity.",
  about_mat1_title: "Contemporary Materials",
  about_mat1_desc: "Modern engineered surfaces engineered for performance and longevity.",
  about_mat2_title: "Standardized Components",
  about_mat2_desc: "Repeatable, tested systems that keep quality and cost predictable.",
  about_mat3_title: "Efficient Sourcing",
  about_mat3_desc: "Direct vendor relationships, transparent margins, no hidden markups.",
  about_mat4_title: "Low-Maintenance Finishes",
  about_mat4_desc: "Wear-resistant, easy-clean surfaces built for daily use.",
  about_mat5_title: "Structural Durability",
  about_mat5_desc: "Joinery and carcasses built to last well beyond the warranty.",
  about_mat6_title: "Balanced Premium",
  about_mat6_desc: "Investment placed where it changes daily experience the most.",
  about_trust_eyebrow: "Trust",
  about_trust_title: "Why clients choose Elite Nest.",
  about_stat1_val: "100%",
  about_stat1_label: "Single-point accountability",
  about_stat2_val: "On-time",
  about_stat2_label: "Disciplined delivery",
  about_stat3_val: "Pan-India",
  about_stat3_label: "Turnkey execution",
  about_stat4_val: "Concept → Keys",
  about_stat4_label: "Fully in-house workflow",
  about_trust_points: "Accountability at every stage\nDisciplined, on-site execution\nRealistic timelines, honestly communicated\nTransparent pricing and material choices\nBalanced aesthetics and cost\nQuality control systems, not promises\nPrecision detailing and finishing\nLong-term durability, built-in",
  about_cta_eyebrow: "Built for real life",
  about_cta_title: "Interiors that work better, last longer, and improve every day.",
  about_cta_desc: "Beautiful in photographs is easy. Beautiful to live and work in — for years — is the standard we build to.",
  about_cta_button: "Book a Consultation",
  gallery_hero_title: "Our Project Gallery",
  gallery_hero_subtitle: "Explore our construction, renovation, and interior design works.",
  gallery_hero_image_url: null,
  gallery_featured_eyebrow: "Featured Project",
  gallery_grid_eyebrow: "Selected Work",
  gallery_grid_title: "Project gallery.",
  gallery_video_eyebrow: "Walkthroughs",
  gallery_video_title: "Video walkthroughs.",
  gallery_cta_title: "Like what you see?",
  gallery_cta_subtitle: "Let Elite Nest Interiors create a beautiful, functional, and professionally executed space for you.",
  gallery_cta_btn1: "Contact Us",
  gallery_cta_btn2: "Get a Free Consultation",
  contact_hero_eyebrow: "Get In Touch",
  contact_hero_title: "Let's Build Something That Lasts.",
  contact_hero_subtitle: "Elite Nest Interiors crafts thoughtfully engineered spaces — from intimate residences to signature commercial interiors — delivered with precision across Bengaluru.",
  contact_hero_image_url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1920&q=90",
  contact_hero_cta1: "Book a Free Consultation",
  contact_hero_cta2: "WhatsApp Us",
  contact_stat1_val: "120+",
  contact_stat1_label: "Projects Delivered",
  contact_stat2_val: "15+",
  contact_stat2_label: "Years of Craft",
  contact_stat3_val: "24hr",
  contact_stat3_label: "Response Time",
  contact_enquiry_eyebrow: "Enquiry",
  contact_enquiry_title: "Tell Us About Your Project",
  contact_enquiry_subtitle: "Share a few details and our project consultant will reach out within one business day with a tailored response.",
  contact_guarantee1: "Free design consultation",
  contact_guarantee2: "Transparent quote within 48 hrs",
  contact_guarantee3: "Dedicated project manager",
  contact_map_eyebrow: "Location",
  contact_map_title: "Visit Our Office",
};

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = CURATED_GALLERY.map((c, i) => ({
  id: c.id,
  title: c.title,
  category: c.category,
  image_url: `asset://${c.assetKey}`,
  description: c.description,
  location: c.location,
  display_order: i + 1,
  is_active: true,
}));

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  placeholderData: DEFAULT_SITE_SETTINGS,
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
  staleTime: 30 * 1000,
  refetchOnWindowFocus: true,
  retry: 1,
});

export const categoriesQuery = (opts: { onlyActive?: boolean } = {}) =>
  queryOptions({
    queryKey: ["service_categories", opts.onlyActive ?? true],
    placeholderData: DEFAULT_CATEGORIES,
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
    placeholderData: DEFAULT_SERVICES,
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
    placeholderData: () => DEFAULT_SERVICES.find((s) => s.slug === slug) || DEFAULT_SERVICES[0],
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
    placeholderData: PLACEHOLDER_TESTIMONIALS,
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
    placeholderData: DEFAULT_GALLERY_ITEMS,
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

