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
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Storage Objects table (storing buckets & binary blobs inside PostgreSQL)
CREATE TABLE IF NOT EXISTS public.storage_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT NOT NULL,
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
