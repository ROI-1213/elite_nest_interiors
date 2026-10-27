import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || 'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@localhost:5432/elite47';

console.log('Connecting to PostgreSQL database at localhost:5432/elite47...');

const client = new pg.Client({
  connectionString,
  ssl: false,
});

const DEFAULT_SERVICES = [
  {
    title: 'Turnkey Interior Solutions',
    slug: 'turnkey-interior-solutions',
    short_description: 'One-team complete interior execution from concept to final handover.',
    description: 'Our Turnkey Interior Solutions manage every single aspect of your project — from architectural layout, material procurement, customized modular furniture, electrical & lighting, to final cleaning and handover.',
    image_url: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80',
    display_order: 1,
  },
  {
    title: 'Residential Interior Design',
    slug: 'residential-interior-design',
    short_description: 'Beautiful and practical home interiors designed around comfort, lifestyle, and elegance.',
    description: 'Transforming apartments, villas, and independent houses into bespoke living spaces tailored to your daily routine, aesthetics, and ergonomics.',
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    display_order: 2,
  },
  {
    title: 'Commercial Interior Design',
    slug: 'commercial-interior-design',
    short_description: 'Professional commercial interiors crafted for functionality, branding, and business experience.',
    description: 'Designing corporate offices, retail stores, cafes, and healthcare clinics that inspire productivity, reflect brand identity, and maximize space efficiency.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    display_order: 3,
  },
  {
    title: 'Renovation & Remodeling',
    slug: 'renovation-remodeling',
    short_description: 'Transform old or underused spaces into elegant, functional, and modern environments.',
    description: 'Breathing new life into legacy homes and commercial spaces with structural upgrades, modern layout reconfigurations, and premium finishes.',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    display_order: 4,
  },
  {
    title: 'Construction Services',
    slug: 'construction-services',
    short_description: 'End-to-end construction solutions for homes, villas, and commercial spaces built with quality and precision.',
    description: 'From foundation laying to RCC frame construction, civil work, plumbing, and roofing — engineered to highest structural standards.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    display_order: 5,
  },
  {
    title: 'Architectural Design & Planning',
    slug: 'architectural-design-planning',
    short_description: 'Detailed architectural planning and execution-ready drawings for clear, refined building development.',
    description: 'Elevation design, floor planning, 3D architectural modeling, and municipal submission drawings crafted with precision.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    display_order: 6,
  },
  {
    title: 'Structural Design',
    slug: 'structural-design',
    short_description: 'Smart structural planning for strong, efficient, and long-lasting buildings.',
    description: 'Detailed load calculations, column & beam layout designs, foundation engineering, and seismic design verification.',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    display_order: 7,
  },
  {
    title: 'Building Supervision',
    slug: 'building-supervision',
    short_description: 'Professional site monitoring to ensure your project is executed correctly, safely, and on schedule.',
    description: 'Rigorous quality control inspections, material testing, milestone audits, and daily progress reporting.',
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    display_order: 8,
  },
  {
    title: '3D Walkthrough Gallery',
    slug: '3d-walkthrough-gallery',
    short_description: 'Immersive 3D walkthroughs that help you experience your space before execution.',
    description: 'High-definition 3D rendering and virtual reality walkthroughs allowing you to visualize lighting, textures, and spatial flow before construction begins.',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    display_order: 9,
  },
];

const DEFAULT_GALLERY = [
  { title: "Villa Under Construction, Whitefield", category: "Construction", description: "Premium independent villa framing works in progress.", image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80", display_order: 1 },
  { title: "Modern Facade, Hebbal", category: "Construction", description: "Contemporary Bengaluru villa exterior with teak slatted screens.", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", display_order: 2 },
  { title: "Warm Family Living Room, Jayanagar", category: "Residential Interiors", description: "Teak paneling, plush seating, and warm golden lighting.", image_url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80", display_order: 3 },
  { title: "Contemporary Residence, Basavanagudi", category: "Residential Interiors", description: "Refined materials, warm tones, and modern Indian elegance.", image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", display_order: 4 },
  { title: "Premium Office Reception, MG Road", category: "Commercial Interiors", description: "Warm teak paneling and marble lounge.", image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", display_order: 5 },
  { title: "Renovated South Indian Home, Malleshwaram", category: "Renovation", description: "Restored heritage feel with modern comfort.", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", display_order: 6 },
  { title: "Completed Villa Handover, Devanahalli", category: "Turnkey Projects", description: "Turnkey luxury villa with grand foyer.", image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", display_order: 7 },
  { title: "Modern Villa Exterior, Yelahanka", category: "Turnkey Projects", description: "End-to-end contemporary villa build.", image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", display_order: 8 },
  { title: "Master Bedroom Suite, JP Nagar", category: "Bedrooms", description: "Custom teak wardrobe with cove ceiling lighting.", image_url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", display_order: 9 },
  { title: "Luxury Guest Bedroom, Koramangala", category: "Bedrooms", description: "Warm wooden accents with ambient bedside lighting.", image_url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", display_order: 10 },
  { title: "Luxury Living Lounge, Indiranagar", category: "Living Rooms", description: "Teak wood paneling with soft ambient illumination.", image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", display_order: 11 },
  { title: "Bengaluru Modular Kitchen, Kaggadasapura", category: "Kitchens", description: "Dark granite countertops with warm oak cabinetry.", image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", display_order: 12 },
  { title: "Modern Parallel Kitchen, HSR Layout", category: "Kitchens", description: "Indian-friendly layout with durable quartz surfaces.", image_url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80", display_order: 13 },
  { title: "Villa Dining Area, Kanakapura Road", category: "Dining", description: "Solid teak 6-seater dining table with brass chandelier.", image_url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80", display_order: 14 },
  { title: "Apartment Dining Zone, Sarjapur", category: "Dining", description: "Warm wood dining setup under warm ambient light.", image_url: "https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&w=1200&q=80", display_order: 15 },
  { title: "Traditional-Modern Pooja Room, Girinagar", category: "Pooja / Foyer", description: "Carved teak mandir with brass diyas and marble floor.", image_url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80", display_order: 16 },
  { title: "Grand Foyer Entrance, Sadashivanagar", category: "Pooja / Foyer", description: "Teak wood entryway with warm golden accents.", image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", display_order: 17 },
];

async function main() {
  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL database!');

    const schemaSqlPath = path.join(__dirname, '../src/db/schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');

    console.log('Running DDL Schema...');
    await client.query(schemaSql);
    console.log('Schema executed successfully!');

    // Create default admin user if not exists
    const adminEmail = 'elitenestinteriors@gmail.com';
    const adminPassword = 'elitenest@2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    const userRes = await client.query(
      `INSERT INTO public.users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id;`,
      [adminEmail, hash]
    );

    const userId = userRes.rows[0].id;

    await client.query(
      `INSERT INTO public.user_roles (user_id, role)
       VALUES ($1, 'admin')
       ON CONFLICT (user_id, role) DO NOTHING;`,
      [userId]
    );

    // Seed default services
    console.log('Seeding default services into PostgreSQL database...');
    for (const s of DEFAULT_SERVICES) {
      await client.query(
        `INSERT INTO public.services (title, slug, short_description, description, image_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           short_description = EXCLUDED.short_description,
           description = EXCLUDED.description,
           image_url = EXCLUDED.image_url,
           display_order = EXCLUDED.display_order;`,
        [s.title, s.slug, s.short_description, s.description, s.image_url, s.display_order]
      );
    }
    console.log('Services seeded successfully!');

    // Seed default gallery items
    console.log('Seeding default gallery items into PostgreSQL database...');
    await client.query('DELETE FROM public.gallery_items WHERE title IS NOT NULL;');
    for (const g of DEFAULT_GALLERY) {
      await client.query(
        `INSERT INTO public.gallery_items (title, category, description, image_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, true);`,
        [g.title, g.category, g.description, g.image_url, g.display_order]
      );
    }
    // Seed default testimonials
    console.log('Seeding default testimonials into PostgreSQL database...');
    await client.query('DELETE FROM public.testimonials WHERE author_name IS NOT NULL;');
    const DEFAULT_TESTIMONIALS = [
      { author_name: "Anitha Reddy", author_location: "Koramangala, Bengaluru", rating: 5, content: "Elite Nest handled our 3BHK interiors end-to-end. The detailing, materials and on-time delivery exceeded expectations.", service_type: "Interior Design", display_order: 1 },
      { author_name: "Rahul Verma", author_location: "Indiranagar, Bengaluru", rating: 5, content: "Their site supervision was clear and disciplined. Weekly reports and proactive coordination kept the build on track.", service_type: "Supervision", display_order: 2 },
      { author_name: "Sneha Iyer", author_location: "Whitefield, Bengaluru", rating: 5, content: "We chose the turnkey package and didn't have to chase anyone. Quality, budget and timeline were respected throughout.", service_type: "Turnkey Solution", display_order: 3 },
      { author_name: "Mohammed Ali", author_location: "Jayanagar, Bengaluru", rating: 5, content: "From foundation to finishing, the construction team was professional and material quality was excellent.", service_type: "Construction", display_order: 4 },
      { author_name: "Divya Krishnan", author_location: "HSR Layout, Bengaluru", rating: 5, content: "Our old home felt brand new after the renovation. Elegant choices, smart space planning and clean execution.", service_type: "Renovation", display_order: 5 },
      { author_name: "Vivek & Pooja", author_location: "Sarjapur Road, Bengaluru", rating: 5, content: "Beautiful, functional interiors with a personal touch. The team listened to every detail and delivered with class.", service_type: "Interior Design", display_order: 6 },
    ];
    for (const t of DEFAULT_TESTIMONIALS) {
      await client.query(
        `INSERT INTO public.testimonials (author_name, author_location, rating, content, service_type, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true);`,
        [t.author_name, t.author_location, t.rating, t.content, t.service_type, t.display_order]
      );
    }
    console.log('Testimonials seeded successfully!');

    // Ensure all site_settings columns exist
    await client.query(`
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_eyebrow TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS why_us_title TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS traditional_firm_title TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS traditional_firm_points TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS elitenest_title TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS elitenest_points TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_hero_title TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_hero_subtitle TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_positioning TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS mission_title TEXT;
    `);

    // Seed default site settings
    console.log('Seeding default site settings into PostgreSQL database...');
    const defaultTrad = `Beautiful designs that lack practicality\nHidden costs and budget overruns\nMultiple vendors, multiple headaches\nDelays and inconsistent execution\nNo clear ownership or accountability\nSpaces designed for looks, not everyday living`;
    const defaultElite = `Function-led designs with timeless aesthetics\nTransparent budgets with no hidden surprises\nSingle-point accountability from start to finish\nStructured execution with on-time delivery\nSmart sourcing for quality and value\nSpaces crafted for real-life comfort and performance`;

    const defaultLinkedin = 'https://www.linkedin.com/in/elite-nest-architects-and-interiors-7b88b5427?utm_source=share_via&utm_content=profile&utm_medium=member_android';

    await client.query(
      `INSERT INTO public.site_settings (
        id, business_name, tagline, phone, whatsapp, email, address, business_hours,
        google_map_url, footer_about, footer_copyright, traditional_firm_points, elitenest_points, linkedin_url
      ) VALUES (
        1,
        'Elite Nest Interiors',
        'Crafting Timeless & Luxurious Interior Spaces',
        '+91 93640 48269',
        '+91 93640 48269',
        'contact@elitenestinteriors.com',
        'No. 42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
        'Mon–Sat · 10am – 7pm',
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v0',
        'End-to-end construction, architecture and interior solutions — crafted for those who notice the details. Trusted by homeowners and businesses across India.',
        '© ${new Date().getFullYear()} Elite Nest Interiors. All rights reserved.',
        $1,
        $2,
        $3
      ) ON CONFLICT (id) DO UPDATE SET
        phone = COALESCE(public.site_settings.phone, EXCLUDED.phone),
        whatsapp = COALESCE(public.site_settings.whatsapp, EXCLUDED.whatsapp),
        email = COALESCE(public.site_settings.email, EXCLUDED.email),
        address = COALESCE(public.site_settings.address, EXCLUDED.address),
        business_hours = COALESCE(public.site_settings.business_hours, EXCLUDED.business_hours),
        linkedin_url = EXCLUDED.linkedin_url,
        traditional_firm_points = COALESCE(public.site_settings.traditional_firm_points, EXCLUDED.traditional_firm_points),
        elitenest_points = COALESCE(public.site_settings.elitenest_points, EXCLUDED.elitenest_points);`,
      [defaultTrad, defaultElite, defaultLinkedin]
    );
    console.log('Site settings seeded successfully!');

    console.log('----------------------------------------------------');
    console.log('SUCCESS: Database initialization completed!');
    console.log(`Admin credentials created:`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('----------------------------------------------------');

  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
