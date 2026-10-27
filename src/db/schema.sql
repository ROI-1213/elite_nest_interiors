-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Custom Enum Types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'user');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enquiry_status') THEN
    CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'in_progress', 'won', 'lost');
  END IF;
END $$;

-- 1. Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 3. Service Categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  image_url TEXT,
  price_from NUMERIC,
  features JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_title TEXT,
  source TEXT,
  status enquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Gallery Items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  location TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  author_location TEXT,
  rating INT NOT NULL DEFAULT 5,
  content TEXT NOT NULL,
  service_type TEXT,
  project_image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Video Testimonials table
CREATE TABLE IF NOT EXISTS public.video_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  author_name TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Site Settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  business_name TEXT NOT NULL DEFAULT 'Elite Nest Interiors',
  tagline TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  google_map_url TEXT,
  business_hours TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  pinterest_url TEXT,
  about_title TEXT,
  about_content TEXT,
  about_image_url TEXT,
  about_hero_title TEXT,
  about_hero_subtitle TEXT,
  about_positioning TEXT,
  vision_title TEXT,
  vision_content TEXT,
  mission_title TEXT,
  mission_content TEXT,
  footer_about TEXT,
  footer_copyright TEXT,
  hero_eyebrow TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  hero_cta_label TEXT,
  why_us_title TEXT,
  traditional_firm_title TEXT,
  traditional_firm_points TEXT,
  elitenest_title TEXT,
  elitenest_points TEXT,
  cta_title TEXT,
  cta_subtitle TEXT,
  process_eyebrow TEXT DEFAULT 'Our process',
  process_title TEXT DEFAULT 'Five steps. Zero surprises.',
  process_step1_title TEXT DEFAULT 'Understand',
  process_step1_desc TEXT DEFAULT 'We understand your lifestyle, preferences, space requirements, and budget.',
  process_step2_title TEXT DEFAULT 'Design',
  process_step2_desc TEXT DEFAULT 'We create functional, elegant designs tailored to your vision.',
  process_step3_title TEXT DEFAULT 'Plan',
  process_step3_desc TEXT DEFAULT 'Detailed drawings, material selection, costing, and execution planning.',
  process_step4_title TEXT DEFAULT 'Execute',
  process_step4_desc TEXT DEFAULT 'Expert project management with strict quality and timeline control.',
  process_step5_title TEXT DEFAULT 'Deliver',
  process_step5_desc TEXT DEFAULT 'A beautifully finished space, delivered on time and ready to enjoy.',
  services_section_title TEXT DEFAULT 'End-to-End Home Interior Services',
  services_section_subtitle TEXT DEFAULT 'Complete interior execution from concept to final handover.',
  categories_section_title TEXT DEFAULT 'Interior Categories Showcase',
  categories_section_subtitle TEXT DEFAULT 'Explore our signature living, bedroom, kitchen, and dining solutions.',
  testimonials_eyebrow TEXT DEFAULT 'Kind words',
  testimonials_title TEXT DEFAULT 'Trusted by homeowners and businesses who care about every detail.',
  video_section_eyebrow TEXT DEFAULT 'Hear it firsthand',
  video_section_title TEXT DEFAULT 'Video testimonials',
  about_hero_eyebrow TEXT DEFAULT 'ABOUT — ELITE NEST INTERIORS',
  about_why_eyebrow TEXT DEFAULT 'Why we exist',
  about_why_title TEXT DEFAULT 'A function-first interior company.',
  about_why_content TEXT,
  about_philosophy_eyebrow TEXT DEFAULT 'Philosophy',
  about_philosophy_title TEXT DEFAULT 'Good design should work hard.',
  about_philosophy_subtitle TEXT,
  about_phil1_title TEXT,
  about_phil1_desc TEXT,
  about_phil2_title TEXT,
  about_phil2_desc TEXT,
  about_phil3_title TEXT,
  about_phil3_desc TEXT,
  about_phil4_title TEXT,
  about_phil4_desc TEXT,
  about_phil5_title TEXT,
  about_phil5_desc TEXT,
  about_phil6_title TEXT,
  about_phil6_desc TEXT,
  about_diff_eyebrow TEXT DEFAULT 'The difference',
  about_diff_title TEXT DEFAULT 'Traditional interior firms vs. the Elite Nest approach.',
  about_diff_trad_title TEXT DEFAULT 'Traditional firms',
  about_diff_trad_subtitle TEXT DEFAULT 'Where projects usually fail',
  about_diff_trad_points TEXT,
  about_diff_elite_title TEXT DEFAULT 'Elite Nest',
  about_diff_elite_subtitle TEXT DEFAULT 'How we deliver differently',
  about_diff_elite_points TEXT,
  about_spaces_eyebrow TEXT DEFAULT 'Spaces we build',
  about_spaces_title TEXT DEFAULT 'Transforming Residential & Commercial Spaces',
  about_spaces_desc TEXT,
  about_mat_eyebrow TEXT DEFAULT 'Material & build',
  about_mat_title TEXT DEFAULT 'Intelligent materials. Honest craftsmanship.',
  about_mat_desc TEXT,
  about_mat1_title TEXT,
  about_mat1_desc TEXT,
  about_mat2_title TEXT,
  about_mat2_desc TEXT,
  about_mat3_title TEXT,
  about_mat3_desc TEXT,
  about_mat4_title TEXT,
  about_mat4_desc TEXT,
  about_mat5_title TEXT,
  about_mat5_desc TEXT,
  about_mat6_title TEXT,
  about_mat6_desc TEXT,
  about_trust_eyebrow TEXT DEFAULT 'Trust',
  about_trust_title TEXT DEFAULT 'Why clients choose Elite Nest.',
  about_stat1_val TEXT DEFAULT '100%',
  about_stat1_label TEXT DEFAULT 'Single-point accountability',
  about_stat2_val TEXT DEFAULT 'On-time',
  about_stat2_label TEXT DEFAULT 'Disciplined delivery',
  about_stat3_val TEXT DEFAULT 'Pan-India',
  about_stat3_label TEXT DEFAULT 'Turnkey execution',
  about_stat4_val TEXT DEFAULT 'Concept → Keys',
  about_stat4_label TEXT DEFAULT 'Fully in-house workflow',
  about_trust_points TEXT,
  about_cta_eyebrow TEXT DEFAULT 'Built for real life',
  about_cta_title TEXT DEFAULT 'Interiors that work better, last longer, and improve every day.',
  about_cta_desc TEXT,
  about_cta_button TEXT DEFAULT 'Book a Consultation',
  gallery_hero_title TEXT DEFAULT 'Our Project Gallery',
  gallery_hero_subtitle TEXT DEFAULT 'Explore our construction, renovation, and interior design works.',
  gallery_hero_image_url TEXT,
  gallery_featured_eyebrow TEXT DEFAULT 'Featured Project',
  gallery_grid_eyebrow TEXT DEFAULT 'Selected Work',
  gallery_grid_title TEXT DEFAULT 'Project gallery.',
  gallery_video_eyebrow TEXT DEFAULT 'Walkthroughs',
  gallery_video_title TEXT DEFAULT 'Video walkthroughs.',
  gallery_cta_title TEXT DEFAULT 'Like what you see?',
  gallery_cta_subtitle TEXT DEFAULT 'Let Elite Nest Interiors create a beautiful, functional, and professionally executed space for you.',
  gallery_cta_btn1 TEXT DEFAULT 'Contact Us',
  gallery_cta_btn2 TEXT DEFAULT 'Get a Free Consultation',
  contact_hero_eyebrow TEXT DEFAULT 'Get In Touch',
  contact_hero_title TEXT DEFAULT 'Let''s Build Something That Lasts.',
  contact_hero_subtitle TEXT,
  contact_hero_image_url TEXT,
  contact_hero_cta1 TEXT DEFAULT 'Book a Free Consultation',
  contact_hero_cta2 TEXT DEFAULT 'WhatsApp Us',
  contact_stat1_val TEXT DEFAULT '120+',
  contact_stat1_label TEXT DEFAULT 'Projects Delivered',
  contact_stat2_val TEXT DEFAULT '15+',
  contact_stat2_label TEXT DEFAULT 'Years of Craft',
  contact_stat3_val TEXT DEFAULT '24hr',
  contact_stat3_label TEXT DEFAULT 'Response Time',
  contact_enquiry_eyebrow TEXT DEFAULT 'Enquiry',
  contact_enquiry_title TEXT DEFAULT 'Tell Us About Your Project',
  contact_enquiry_subtitle TEXT,
  contact_guarantee1 TEXT DEFAULT 'Free design consultation',
  contact_guarantee2 TEXT DEFAULT 'Transparent quote within 48 hrs',
  contact_guarantee3 TEXT DEFAULT 'Dedicated project manager',
  contact_map_eyebrow TEXT DEFAULT 'Location',
  contact_map_title TEXT DEFAULT 'Visit Our Office',
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Storage Buckets table
CREATE TABLE IF NOT EXISTS public.storage_buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.storage_buckets (id, name, public) VALUES
  ('gallery', 'Gallery Images', true),
  ('services', 'Service Images', true),
  ('testimonials', 'Testimonial Images', true),
  ('general', 'General Uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 11. Storage Objects table (storing buckets & binary blobs inside PostgreSQL)
CREATE TABLE IF NOT EXISTS public.storage_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT NOT NULL REFERENCES public.storage_buckets(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_bucket_filename UNIQUE (bucket_id, filename)
);

-- Insert Initial Default Site Settings row if not existing
INSERT INTO public.site_settings (
  id, business_name, tagline, phone, whatsapp, email, address,
  google_map_url, business_hours, hero_title, hero_subtitle,
  about_title, about_content, vision_title, vision_content, mission_content,
  footer_about, footer_copyright
) VALUES (
  1,
  'Elite Nest Interiors',
  'Crafting Timeless & Luxurious Interior Spaces',
  '+91 98765 43210',
  '919876543210',
  'contact@elitenest.com',
  '123 Luxury Avenue, Design District, Bangalore, India',
  'https://maps.google.com',
  'Mon - Sat: 9:00 AM - 7:00 PM',
  'Transforming Houses into Bespoke Dream Homes',
  'Elevate your lifestyle with our world-class interior design services.',
  'About Elite Nest Interiors',
  'Elite Nest Interiors is a premier interior architecture studio specializing in high-end residential and commercial projects.',
  'Our Vision',
  'To redefine luxury living through innovative, elegant, and functional design solutions.',
  'To deliver unparalleled craftsmanship, meticulous attention to detail, and exceptional customer experience.',
  'Elite Nest Interiors - Luxury Interior Architecture & Turnkey Solutions.',
  '© 2026 Elite Nest Interiors. All rights reserved.'
) ON CONFLICT (id) DO NOTHING;
