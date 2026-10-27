import type { Testimonial } from "@/lib/queries";

/**
 * Fallback testimonials shown on the public site when the database is empty.
 * These are mirrored by `scripts/sync-site-content.js` so the admin panel can
 * see and edit the same content that visitors see.
 */
export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "p1",
    author_name: "Anitha Reddy",
    author_location: "Koramangala, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Elite Nest handled our 3BHK interiors end-to-end. The detailing, materials and on-time delivery exceeded expectations.",
    service_type: "Interior Design",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p2",
    author_name: "Rahul Verma",
    author_location: "Indiranagar, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Their site supervision was clear and disciplined. Weekly reports and proactive coordination kept the build on track.",
    service_type: "Supervision",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p3",
    author_name: "Sneha Iyer",
    author_location: "Whitefield, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "We chose the turnkey package and didn't have to chase anyone. Quality, budget and timeline were respected throughout.",
    service_type: "Turnkey Solution",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p4",
    author_name: "Mohammed Ali",
    author_location: "Jayanagar, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "From foundation to finishing, the construction team was professional and material quality was excellent.",
    service_type: "Construction",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p5",
    author_name: "Divya Krishnan",
    author_location: "HSR Layout, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Our old home felt brand new after the renovation. Elegant choices, smart space planning and clean execution.",
    service_type: "Renovation",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p6",
    author_name: "Vivek & Pooja",
    author_location: "Sarjapur Road, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Beautiful, functional interiors with a personal touch. The team listened to every detail and delivered with class.",
    service_type: "Interior Design",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
];

export const SITE_SETTINGS_DEFAULTS: Record<string, string> = {
  business_name: "Elite Nest Interiors",
  tagline: "Crafting Timeless & Luxurious Interior Spaces",
  phone: "+91 93640 48269",
  whatsapp: "+91 93640 48269",
  email: "contact@elitenestinteriors.com",
  address: "No. 42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
  business_hours: "Mon–Sat · 10am – 7pm",
  google_map_url: "https://maps.app.goo.gl/9W8aWwyw2Rfq5vCfA?g_st=iw",
  instagram_url:
    "https://www.instagram.com/elitenest5?igsh=MXdqbDBjaDlwOGYyZQ%3D%3D&utm_source=qr",
  youtube_url:
    "https://youtube.com/@elitenestarchitectsinteriors?si=mNi5o-4Xiko1eLiN",
  linkedin_url:
    "https://www.linkedin.com/in/elite-nest-architects-and-interiors-7b88b5427?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  hero_eyebrow: "Crafting Spaces",
  hero_title: "Where Design Meets\nTimeless Living",
  hero_subtitle:
    "Beautiful interiors. Thoughtful design. Perfectly executed.",
  hero_cta_label: "Explore Our Work",
  cta_title: "Looking For Expert Guidance To Design Your Dream Space?",
  cta_subtitle:
    "Share your requirements and our interior design team will help you plan a beautiful, functional, and personalized space.",
  why_us_title: "Why choose the elitenest",
  traditional_firm_title: "Traditional firm",
  traditional_firm_points: [
    "Beautiful designs that lack practicality",
    "Hidden costs and budget overruns",
    "Multiple vendors, multiple headaches",
    "Delays and inconsistent execution",
    "No clear ownership or accountability",
    "Spaces designed for looks, not everyday living",
  ].join("\n"),
  elitenest_title: "Elite Nest",
  elitenest_points: [
    "Function-led designs with timeless aesthetics",
    "Transparent budgets with no hidden surprises",
    "Single-point accountability from start to finish",
    "Structured execution with on-time delivery",
    "Smart sourcing for quality and value",
    "Spaces crafted for real-life comfort and performance",
  ].join("\n"),
  about_title: "About Elite Nest Interiors",
  about_content:
    "Elite Nest Interiors is a premier interior architecture studio specializing in high-end residential and commercial projects across Bengaluru.",
  about_hero_title: "Design That Performs\nBeyond Appearance.",
  about_hero_subtitle:
    "We create spaces that are functional, durable, aesthetically refined, and intelligently planned — thoughtfully built from concept to completion, at Indian prices.",
  about_positioning: "World-Class Interiors.\nThoughtfully Built.",
  vision_title: "Our Vision",
  vision_content:
    "To redefine luxury living through innovative, elegant, and functional design solutions.",
  mission_title: "Our Mission",
  mission_content:
    "To deliver unparalleled craftsmanship, meticulous attention to detail, and exceptional customer experience.",
  footer_about:
    "End-to-end construction, architecture and interior solutions — crafted for those who notice the details. Trusted by homeowners and businesses across India.",
  footer_copyright: "© 2026 Elite Nest Interiors. All rights reserved.",
};
