import pg from 'pg';

const host = process.env.PGHOST || 'localhost';
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@${host}:5432/elite47`;

async function migrate() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL for homepage settings migration...');

    await client.query(`
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_eyebrow TEXT DEFAULT 'Our process';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_title TEXT DEFAULT 'Five steps. Zero surprises.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step1_title TEXT DEFAULT 'Understand';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step1_desc TEXT DEFAULT 'We understand your lifestyle, preferences, space requirements, and budget.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step2_title TEXT DEFAULT 'Design';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step2_desc TEXT DEFAULT 'We create functional, elegant designs tailored to your vision.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step3_title TEXT DEFAULT 'Plan';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step3_desc TEXT DEFAULT 'Detailed drawings, material selection, costing, and execution planning.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step4_title TEXT DEFAULT 'Execute';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step4_desc TEXT DEFAULT 'Expert project management with strict quality and timeline control.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step5_title TEXT DEFAULT 'Deliver';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS process_step5_desc TEXT DEFAULT 'A beautifully finished space, delivered on time and ready to enjoy.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS services_section_title TEXT DEFAULT 'End-to-End Home Interior Services';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS services_section_subtitle TEXT DEFAULT 'Complete interior execution from concept to final handover.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS categories_section_title TEXT DEFAULT 'Interior Categories Showcase';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS categories_section_subtitle TEXT DEFAULT 'Explore our signature living, bedroom, kitchen, and dining solutions.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS testimonials_eyebrow TEXT DEFAULT 'Kind words';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS testimonials_title TEXT DEFAULT 'Trusted by homeowners and businesses who care about every detail.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_section_eyebrow TEXT DEFAULT 'Hear it firsthand';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS video_section_title TEXT DEFAULT 'Video testimonials';
    `);

    // Ensure default values are populated if null
    await client.query(`
      UPDATE public.site_settings SET
        process_eyebrow = COALESCE(process_eyebrow, 'Our process'),
        process_title = COALESCE(process_title, 'Five steps. Zero surprises.'),
        process_step1_title = COALESCE(process_step1_title, 'Understand'),
        process_step1_desc = COALESCE(process_step1_desc, 'We understand your lifestyle, preferences, space requirements, and budget.'),
        process_step2_title = COALESCE(process_step2_title, 'Design'),
        process_step2_desc = COALESCE(process_step2_desc, 'We create functional, elegant designs tailored to your vision.'),
        process_step3_title = COALESCE(process_step3_title, 'Plan'),
        process_step3_desc = COALESCE(process_step3_desc, 'Detailed drawings, material selection, costing, and execution planning.'),
        process_step4_title = COALESCE(process_step4_title, 'Execute'),
        process_step4_desc = COALESCE(process_step4_desc, 'Expert project management with strict quality and timeline control.'),
        process_step5_title = COALESCE(process_step5_title, 'Deliver'),
        process_step5_desc = COALESCE(process_step5_desc, 'A beautifully finished space, delivered on time and ready to enjoy.'),
        services_section_title = COALESCE(services_section_title, 'End-to-End Home Interior Services'),
        services_section_subtitle = COALESCE(services_section_subtitle, 'Complete interior execution from concept to final handover.'),
        categories_section_title = COALESCE(categories_section_title, 'Interior Categories Showcase'),
        categories_section_subtitle = COALESCE(categories_section_subtitle, 'Explore our signature living, bedroom, kitchen, and dining solutions.'),
        testimonials_eyebrow = COALESCE(testimonials_eyebrow, 'Kind words'),
        testimonials_title = COALESCE(testimonials_title, 'Trusted by homeowners and businesses who care about every detail.'),
        video_section_eyebrow = COALESCE(video_section_eyebrow, 'Hear it firsthand'),
        video_section_title = COALESCE(video_section_title, 'Video testimonials')
      WHERE id = 1;
    `);

    console.log('Homepage settings columns successfully migrated!');
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
