import pg from 'pg';

const host = process.env.PGHOST || 'localhost';
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@${host}:5432/elite47`;

async function migrate() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL for gallery settings migration...');

    // 1. Add location to gallery_items
    await client.query(`
      ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS location TEXT;
    `);

    // 2. Add gallery page settings to site_settings
    await client.query(`
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_hero_title TEXT DEFAULT 'Our Project Gallery';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_hero_subtitle TEXT DEFAULT 'Explore our construction, renovation, and interior design works.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_hero_image_url TEXT;
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_featured_eyebrow TEXT DEFAULT 'Featured Project';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_grid_eyebrow TEXT DEFAULT 'Selected Work';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_grid_title TEXT DEFAULT 'Project gallery.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_video_eyebrow TEXT DEFAULT 'Walkthroughs';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_video_title TEXT DEFAULT 'Video walkthroughs.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_cta_title TEXT DEFAULT 'Like what you see?';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_cta_subtitle TEXT DEFAULT 'Let Elite Nest Interiors create a beautiful, functional, and professionally executed space for you.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_cta_btn1 TEXT DEFAULT 'Contact Us';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gallery_cta_btn2 TEXT DEFAULT 'Get a Free Consultation';
    `);

    // Populate defaults on row 1 of site_settings
    await client.query(`
      UPDATE public.site_settings SET
        gallery_hero_title = COALESCE(gallery_hero_title, 'Our Project Gallery'),
        gallery_hero_subtitle = COALESCE(gallery_hero_subtitle, 'Explore our construction, renovation, and interior design works.'),
        gallery_featured_eyebrow = COALESCE(gallery_featured_eyebrow, 'Featured Project'),
        gallery_grid_eyebrow = COALESCE(gallery_grid_eyebrow, 'Selected Work'),
        gallery_grid_title = COALESCE(gallery_grid_title, 'Project gallery.'),
        gallery_video_eyebrow = COALESCE(gallery_video_eyebrow, 'Walkthroughs'),
        gallery_video_title = COALESCE(gallery_video_title, 'Video walkthroughs.'),
        gallery_cta_title = COALESCE(gallery_cta_title, 'Like what you see?'),
        gallery_cta_subtitle = COALESCE(gallery_cta_subtitle, 'Let Elite Nest Interiors create a beautiful, functional, and professionally executed space for you.'),
        gallery_cta_btn1 = COALESCE(gallery_cta_btn1, 'Contact Us'),
        gallery_cta_btn2 = COALESCE(gallery_cta_btn2, 'Get a Free Consultation')
      WHERE id = 1;
    `);

    // Populate locations for existing items
    const locations = [
      { title: 'Villa Under Construction, Whitefield', location: 'Whitefield, Bengaluru' },
      { title: 'Modern Facade, Hebbal', location: 'Hebbal' },
      { title: 'Warm Family Living Room, Jayanagar', location: 'Jayanagar' },
      { title: 'Contemporary Residence, Basavanagudi', location: 'Basavanagudi' },
      { title: 'Premium Office Reception, MG Road', location: 'MG Road' },
      { title: 'Renovated South Indian Home, Malleshwaram', location: 'Malleshwaram' },
      { title: 'Completed Villa Handover, Devanahalli', location: 'Devanahalli' },
      { title: 'Modern Villa Exterior, Yelahanka', location: 'Yelahanka' },
      { title: 'Master Bedroom Suite, JP Nagar', location: 'JP Nagar' },
      { title: 'Luxury Guest Bedroom, Koramangala', location: 'Koramangala' },
      { title: 'Luxury Living Lounge, Indiranagar', location: 'Indiranagar' },
      { title: 'Bengaluru Modular Kitchen, Kaggadasapura', location: 'Kaggadasapura' },
      { title: 'Modern Parallel Kitchen, HSR Layout', location: 'HSR Layout' },
      { title: 'Villa Dining Area, Kanakapura Road', location: 'Kanakapura Road' },
      { title: 'Apartment Dining Zone, Sarjapur', location: 'Sarjapur Road' },
      { title: 'Traditional-Modern Pooja Room, Girinagar', location: 'Girinagar' },
      { title: 'Grand Foyer Entrance, Sadashivanagar', location: 'Sadashivanagar' },
    ];

    for (const item of locations) {
      await client.query(
        `UPDATE public.gallery_items SET location = $1 WHERE title = $2 AND (location IS NULL OR location = '')`,
        [item.location, item.title]
      );
    }

    console.log('Gallery settings and locations successfully migrated!');
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
