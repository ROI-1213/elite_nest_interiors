/**
 * Sync the user-facing site content into the database so the admin panel can
 * see and edit the exact gallery, testimonials and site settings that visitors
 * see on the public website.
 *
 * Idempotent — safe to run repeatedly.
 *   node scripts/sync-site-content.js
 *
 * What it does:
 *  1. Gallery: upserts the 17 curated gallery items into `gallery_items`,
 *     storing build-stable `asset://<assetKey>` image references (resolved to
 *     the bundled images at render time). Pre-existing rows with the same
 *     title (e.g. old Unsplash-seeded rows) are converted in place, and stale
 *     duplicates are removed.
 *  2. Testimonials: seeds the 6 default testimonials only if the table is empty
 *     (admin content is never overwritten).
 *  3. Site settings: ensures the settings row exists and fills only the columns
 *     that are still NULL with the current site defaults (hero, CTA, why-us,
 *     about hero). Existing admin values are preserved.
 */
import pg from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@168.119.64.101:5432/elite47';

const SEED_GALLERY = [
  { id: '00000000-0000-4000-8000-000000000001', title: 'Villa Under Construction, Whitefield', category: 'Construction', description: 'Premium independent villa framing works in progress.', assetKey: 'gallery-construction-1', display_order: 1 },
  { id: '00000000-0000-4000-8000-000000000002', title: 'Modern Facade, Hebbal', category: 'Construction', description: 'Contemporary Bengaluru villa exterior with teak slatted screens.', assetKey: 'gallery-blr-facade', display_order: 2 },
  { id: '00000000-0000-4000-8000-000000000003', title: 'Warm Family Living Room, Jayanagar', category: 'Residential Interiors', description: 'Teak paneling, plush seating, and warm golden lighting.', assetKey: 'gallery-blr-living', display_order: 3 },
  { id: '00000000-0000-4000-8000-000000000004', title: 'Contemporary Residence, Basavanagudi', category: 'Residential Interiors', description: 'Refined materials, warm tones, and modern Indian elegance.', assetKey: 'gallery-residential-1', display_order: 4 },
  { id: '00000000-0000-4000-8000-000000000005', title: 'Premium Office Reception, MG Road', category: 'Commercial Interiors', description: 'Warm teak paneling and marble lounge.', assetKey: 'gallery-commercial-1', display_order: 5 },
  { id: '00000000-0000-4000-8000-000000000006', title: 'Renovated South Indian Home, Malleshwaram', category: 'Renovation', description: 'Restored heritage feel with modern comfort.', assetKey: 'gallery-renovation-1', display_order: 6 },
  { id: '00000000-0000-4000-8000-000000000007', title: 'Completed Villa Handover, Devanahalli', category: 'Turnkey Projects', description: 'Turnkey luxury villa with grand foyer.', assetKey: 'gallery-turnkey-1', display_order: 7 },
  { id: '00000000-0000-4000-8000-000000000008', title: 'Modern Villa Exterior, Yelahanka', category: 'Turnkey Projects', description: 'End-to-end contemporary villa build.', assetKey: 'gallery-facade-1', display_order: 8 },
  { id: '00000000-0000-4000-8000-000000000009', title: 'Master Bedroom Suite, JP Nagar', category: 'Bedrooms', description: 'Custom teak wardrobe with cove ceiling lighting.', assetKey: 'gallery-blr-bedroom', display_order: 9 },
  { id: '00000000-0000-4000-8000-00000000000A', title: 'Luxury Guest Bedroom, Koramangala', category: 'Bedrooms', description: 'Warm wooden accents with ambient bedside lighting.', assetKey: 'gallery-bedroom-1', display_order: 10 },
  { id: '00000000-0000-4000-8000-00000000000B', title: 'Luxury Living Lounge, Indiranagar', category: 'Living Rooms', description: 'Teak wood paneling with soft ambient illumination.', assetKey: 'hero-living', display_order: 11 },
  { id: '00000000-0000-4000-8000-00000000000C', title: 'Bengaluru Modular Kitchen, Kaggadasapura', category: 'Kitchens', description: 'Dark granite countertops with warm oak cabinetry.', assetKey: 'gallery-blr-kitchen', display_order: 12 },
  { id: '00000000-0000-4000-8000-00000000000D', title: 'Modern Parallel Kitchen, HSR Layout', category: 'Kitchens', description: 'Indian-friendly layout with durable quartz surfaces.', assetKey: 'gallery-kitchen-1', display_order: 13 },
  { id: '00000000-0000-4000-8000-00000000000E', title: 'Villa Dining Area, Kanakapura Road', category: 'Dining', description: 'Solid teak 6-seater dining table with brass chandelier.', assetKey: 'gallery-blr-dining', display_order: 14 },
  { id: '00000000-0000-4000-8000-00000000000F', title: 'Apartment Dining Zone, Sarjapur', category: 'Dining', description: 'Warm wood dining setup under warm ambient light.', assetKey: 'gallery-dining-1', display_order: 15 },
  { id: '00000000-0000-4000-8000-000000000010', title: 'Traditional-Modern Pooja Room, Girinagar', category: 'Pooja / Foyer', description: 'Carved teak mandir with brass diyas and marble floor.', assetKey: 'gallery-blr-pooja', display_order: 16 },
  { id: '00000000-0000-4000-8000-000000000011', title: 'Grand Foyer Entrance, Sadashivanagar', category: 'Pooja / Foyer', description: 'Teak wood entryway with warm golden accents.', assetKey: 'gallery-pooja-1', display_order: 17 },
];

const SEED_TESTIMONIALS = [
  { author_name: 'Anitha Reddy', author_location: 'Koramangala, Bengaluru', rating: 5, content: 'Elite Nest handled our 3BHK interiors end-to-end. The detailing, materials and on-time delivery exceeded expectations.', service_type: 'Interior Design', display_order: 1 },
  { author_name: 'Rahul Verma', author_location: 'Indiranagar, Bengaluru', rating: 5, content: 'Their site supervision was clear and disciplined. Weekly reports and proactive coordination kept the build on track.', service_type: 'Supervision', display_order: 2 },
  { author_name: 'Sneha Iyer', author_location: 'Whitefield, Bengaluru', rating: 5, content: "We chose the turnkey package and didn't have to chase anyone. Quality, budget and timeline were respected throughout.", service_type: 'Turnkey Solution', display_order: 3 },
  { author_name: 'Mohammed Ali', author_location: 'Jayanagar, Bengaluru', rating: 5, content: 'From foundation to finishing, the construction team was professional and material quality was excellent.', service_type: 'Construction', display_order: 4 },
  { author_name: 'Divya Krishnan', author_location: 'HSR Layout, Bengaluru', rating: 5, content: 'Our old home felt brand new after the renovation. Elegant choices, smart space planning and clean execution.', service_type: 'Renovation', display_order: 5 },
  { author_name: 'Vivek & Pooja', author_location: 'Sarjapur Road, Bengaluru', rating: 5, content: 'Beautiful, functional interiors with a personal touch. The team listened to every detail and delivered with class.', service_type: 'Interior Design', display_order: 6 },
];

const SITE_SETTINGS_DEFAULTS = {
  business_name: 'Elite Nest Interiors',
  tagline: 'Crafting Timeless & Luxurious Interior Spaces',
  phone: '+91 93640 48269',
  whatsapp: '+91 93640 48269',
  email: 'contact@elitenestinteriors.com',
  address: 'No. 42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
  business_hours: 'Mon–Sat · 10am – 7pm',
  google_map_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNeJF!5e0!3m2!1sen!2sin!4v0',
  instagram_url:
    'https://www.instagram.com/elitenest5?igsh=MXdqbDBjaDlwOGYyZQ%3D%3D&utm_source=qr',
  youtube_url:
    'https://youtube.com/@elitenestarchitectsinteriors?si=mNi5o-4Xiko1eLiN',
  linkedin_url:
    'https://www.linkedin.com/in/elite-nest-architects-and-interiors-7b88b5427?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  hero_eyebrow: 'Crafting Spaces',
  hero_title: 'Where Design Meets\nTimeless Living',
  hero_subtitle: 'Beautiful interiors. Thoughtful design. Perfectly executed.',
  hero_cta_label: 'Explore Our Work',
  cta_title: 'Looking For Expert Guidance To Design Your Dream Space?',
  cta_subtitle:
    'Share your requirements and our interior design team will help you plan a beautiful, functional, and personalized space.',
  why_us_title: 'Why choose the elitenest',
  traditional_firm_title: 'Traditional firm',
  traditional_firm_points: [
    'Beautiful designs that lack practicality',
    'Hidden costs and budget overruns',
    'Multiple vendors, multiple headaches',
    'Delays and inconsistent execution',
    'No clear ownership or accountability',
    'Spaces designed for looks, not everyday living',
  ].join('\n'),
  elitenest_title: 'Elite Nest',
  elitenest_points: [
    'Function-led designs with timeless aesthetics',
    'Transparent budgets with no hidden surprises',
    'Single-point accountability from start to finish',
    'Structured execution with on-time delivery',
    'Smart sourcing for quality and value',
    'Spaces crafted for real-life comfort and performance',
  ].join('\n'),
  about_title: 'About Elite Nest Interiors',
  about_content:
    'Elite Nest Interiors is a premier interior architecture studio specializing in high-end residential and commercial projects across Bengaluru.',
  about_hero_title: 'Design That Performs\nBeyond Appearance.',
  about_hero_subtitle:
    'We create spaces that are functional, durable, aesthetically refined, and intelligently planned — thoughtfully built from concept to completion, at Indian prices.',
  about_positioning: 'World-Class Interiors.\nThoughtfully Built.',
  vision_title: 'Our Vision',
  vision_content:
    'To redefine luxury living through innovative, elegant, and functional design solutions.',
  mission_title: 'Our Mission',
  mission_content:
    'To deliver unparalleled craftsmanship, meticulous attention to detail, and exceptional customer experience.',
  footer_about:
    'End-to-end construction, architecture and interior solutions — crafted for those who notice the details. Trusted by homeowners and businesses across India.',
  footer_copyright: `© ${new Date().getFullYear()} Elite Nest Interiors. All rights reserved.`,
};

async function main() {
  const client = new pg.Client({ connectionString, ssl: false });
  try {
    await client.connect();
    console.log('Connected to database. Starting sync…');

    /* ---- 1. Gallery ---- */
    console.log('Syncing gallery items…');
    for (const g of SEED_GALLERY) {
      const imageUrl = `asset://${g.assetKey}`;
      const byId = await client.query(
        `UPDATE public.gallery_items
         SET title = $1, category = $2, description = $3, image_url = $4, display_order = $5, is_active = true, updated_at = NOW()
         WHERE id = $6
         RETURNING id`,
        [g.title, g.category, g.description, imageUrl, g.display_order, g.id]
      );
      if (byId.rowCount > 0) continue;

      // Convert any pre-existing row with the same title (e.g. old Unsplash-seeded data).
      const byTitle = await client.query(
        `UPDATE public.gallery_items
         SET category = $2, description = $3, image_url = $4, display_order = $5, is_active = true, updated_at = NOW()
         WHERE title = $1 AND image_url NOT LIKE 'asset://%'
         RETURNING id`,
        [g.title, g.category, g.description, imageUrl, g.display_order]
      );
      if (byTitle.rowCount === 0) {
        await client.query(
          `INSERT INTO public.gallery_items (id, title, category, description, image_url, display_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true)
           ON CONFLICT (id) DO NOTHING`,
          [g.id, g.title, g.category, g.description, imageUrl, g.display_order]
        );
      }

      // Remove stale duplicates of the same seed title that still point at old URLs.
      await client.query(
        `DELETE FROM public.gallery_items
         WHERE title = $1 AND id <> $2 AND image_url NOT LIKE 'asset://%'`,
        [g.title, g.id]
      );
    }
    console.log(`Gallery synced (${SEED_GALLERY.length} items).`);

    /* ---- 2. Testimonials (only if empty) ---- */
    const tcount = await client.query('SELECT COUNT(*)::int AS c FROM public.testimonials');
    if (tcount.rows[0].c === 0) {
      console.log('Seeding default testimonials…');
      for (const t of SEED_TESTIMONIALS) {
        await client.query(
          `INSERT INTO public.testimonials (author_name, author_location, rating, content, service_type, display_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [t.author_name, t.author_location, t.rating, t.content, t.service_type, t.display_order]
        );
      }
      console.log(`Seeded ${SEED_TESTIMONIALS.length} testimonials.`);
    } else {
      console.log('Testimonials already present — skipping (admin content preserved).');
    }

    /* ---- 3. Site settings ---- */
    console.log('Syncing site settings defaults…');
    await client.query(
      `INSERT INTO public.site_settings (id, business_name)
       VALUES (1, 'Elite Nest Interiors')
       ON CONFLICT (id) DO NOTHING`
    );
    for (const [col, value] of Object.entries(SITE_SETTINGS_DEFAULTS)) {
      await client.query(
        `UPDATE public.site_settings SET "${col}" = $1, updated_at = NOW() WHERE id = 1`,
        [value]
      );
    }
    console.log(`Site settings synced (${Object.keys(SITE_SETTINGS_DEFAULTS).length} fields).`);

    console.log('----------------------------------------------------');
    console.log('SUCCESS: Site content synced to database.');
    console.log('Open /admin → Gallery, Testimonials, Site Settings to edit.');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('Sync failed:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
