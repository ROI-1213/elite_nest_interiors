import pg from 'pg';

const host = process.env.PGHOST || 'localhost';
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@${host}:5432/elite47`;

async function migrate() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL for About Us page settings migration...');

    await client.query(`
      -- Hero & Why We Exist
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_hero_eyebrow TEXT DEFAULT 'ABOUT — ELITE NEST INTERIORS';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_why_eyebrow TEXT DEFAULT 'Why we exist';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_why_title TEXT DEFAULT 'A function-first interior company.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_why_content TEXT DEFAULT 'Elite Nest Architects & Interiors is a premier design and execution firm dedicated to creating elegant, functional, and inspiring spaces. We specialize in residential, commercial, and turnkey interior solutions that reflect our clients’ lifestyle, vision, and aspirations.\n\nWith a passion for innovation and attention to detail, we transform ordinary spaces into extraordinary environments through thoughtful planning, modern design concepts, and high-quality craftsmanship.';

      -- Philosophy Section
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_philosophy_eyebrow TEXT DEFAULT 'Philosophy';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_philosophy_title TEXT DEFAULT 'Good design should work hard.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_philosophy_subtitle TEXT DEFAULT 'Smart design works better than simply attractive design. Every decision is guided by usability, storage efficiency, hygiene, workflow, ease of cleaning and structural integrity.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil1_title TEXT DEFAULT 'Function Before Decoration';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil1_desc TEXT DEFAULT 'Every element earns its place through daily usefulness — not just visual appeal.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil2_title TEXT DEFAULT 'Timeless Over Trendy';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil2_desc TEXT DEFAULT 'We design for a decade of relevance, not a season of applause.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil3_title TEXT DEFAULT 'Smart Cost Optimization';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil3_desc TEXT DEFAULT 'Premium where it matters, disciplined everywhere else.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil4_title TEXT DEFAULT 'Precision in Execution';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil4_desc TEXT DEFAULT 'Millimetre-level detailing, dimensionally accurate joinery, consistent finishes.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil5_title TEXT DEFAULT 'Durability Matters';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil5_desc TEXT DEFAULT 'Materials and construction chosen to withstand real, everyday use.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil6_title TEXT DEFAULT 'Maintenance-Friendly';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_phil6_desc TEXT DEFAULT 'Surfaces, hardware, and layouts that are easy to clean, service, and live with.';

      -- Comparison Difference Section
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_eyebrow TEXT DEFAULT 'The difference';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_title TEXT DEFAULT 'Traditional interior firms vs. the Elite Nest approach.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_trad_title TEXT DEFAULT 'Traditional firms';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_trad_subtitle TEXT DEFAULT 'Where projects usually fail';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_trad_points TEXT DEFAULT 'Beautiful designs that lack practicality\nHidden costs and budget overruns\nMultiple vendors, multiple headaches\nDelays and inconsistent execution\nNo clear ownership or accountability\nSpaces designed for looks, not everyday living';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_elite_title TEXT DEFAULT 'Elite Nest';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_elite_subtitle TEXT DEFAULT 'How we deliver differently';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_diff_elite_points TEXT DEFAULT 'Function-led designs with timeless aesthetics\nTransparent budgets with no hidden surprises\nSingle-point accountability from start to finish\nStructured execution with on-time delivery\nSmart sourcing for quality and value\nSpaces crafted for real-life comfort and performance';

      -- Spaces We Build Section
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_spaces_eyebrow TEXT DEFAULT 'Spaces we build';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_spaces_title TEXT DEFAULT 'Transforming Residential & Commercial Spaces';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_spaces_desc TEXT DEFAULT 'From residences to commercial spaces, Elite Nest delivers end-to-end interior solutions—from concept and design to execution and handover, ensuring a seamless experience at every stage.';

      -- Material & Build Section
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat_eyebrow TEXT DEFAULT 'Material & build';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat_title TEXT DEFAULT 'Intelligent materials. Honest craftsmanship.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat_desc TEXT DEFAULT 'We invest in premium materials where they change daily experience, and optimize elsewhere to protect your budget without compromising longevity.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat1_title TEXT DEFAULT 'Contemporary Materials';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat1_desc TEXT DEFAULT 'Modern engineered surfaces engineered for performance and longevity.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat2_title TEXT DEFAULT 'Standardized Components';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat2_desc TEXT DEFAULT 'Repeatable, tested systems that keep quality and cost predictable.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat3_title TEXT DEFAULT 'Efficient Sourcing';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat3_desc TEXT DEFAULT 'Direct vendor relationships, transparent margins, no hidden markups.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat4_title TEXT DEFAULT 'Low-Maintenance Finishes';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat4_desc TEXT DEFAULT 'Wear-resistant, easy-clean surfaces built for daily use.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat5_title TEXT DEFAULT 'Structural Durability';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat5_desc TEXT DEFAULT 'Joinery and carcasses built to last well beyond the warranty.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat6_title TEXT DEFAULT 'Balanced Premium';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_mat6_desc TEXT DEFAULT 'Investment placed where it changes daily experience the most.';

      -- Trust Section
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_trust_eyebrow TEXT DEFAULT 'Trust';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_trust_title TEXT DEFAULT 'Why clients choose Elite Nest.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat1_val TEXT DEFAULT '100%';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat1_label TEXT DEFAULT 'Single-point accountability';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat2_val TEXT DEFAULT 'On-time';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat2_label TEXT DEFAULT 'Disciplined delivery';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat3_val TEXT DEFAULT 'Pan-India';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat3_label TEXT DEFAULT 'Turnkey execution';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat4_val TEXT DEFAULT 'Concept → Keys';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_stat4_label TEXT DEFAULT 'Fully in-house workflow';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_trust_points TEXT DEFAULT 'Accountability at every stage\nDisciplined, on-site execution\nRealistic timelines, honestly communicated\nTransparent pricing and material choices\nBalanced aesthetics and cost\nQuality control systems, not promises\nPrecision detailing and finishing\nLong-term durability, built-in';

      -- Closing Banner & CTA
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_cta_eyebrow TEXT DEFAULT 'Built for real life';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_cta_title TEXT DEFAULT 'Interiors that work better, last longer, and improve every day.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_cta_desc TEXT DEFAULT 'Beautiful in photographs is easy. Beautiful to live and work in — for years — is the standard we build to.';
      ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_cta_button TEXT DEFAULT 'Book a Consultation';
    `);

    // Ensure defaults are set if null on row 1
    await client.query(`
      UPDATE public.site_settings SET
        about_hero_eyebrow = COALESCE(about_hero_eyebrow, 'ABOUT — ELITE NEST INTERIORS'),
        about_why_eyebrow = COALESCE(about_why_eyebrow, 'Why we exist'),
        about_why_title = COALESCE(about_why_title, 'A function-first interior company.'),
        about_why_content = COALESCE(about_why_content, 'Elite Nest Architects & Interiors is a premier design and execution firm dedicated to creating elegant, functional, and inspiring spaces. We specialize in residential, commercial, and turnkey interior solutions that reflect our clients’ lifestyle, vision, and aspirations.\n\nWith a passion for innovation and attention to detail, we transform ordinary spaces into extraordinary environments through thoughtful planning, modern design concepts, and high-quality craftsmanship.'),
        about_philosophy_eyebrow = COALESCE(about_philosophy_eyebrow, 'Philosophy'),
        about_philosophy_title = COALESCE(about_philosophy_title, 'Good design should work hard.'),
        about_philosophy_subtitle = COALESCE(about_philosophy_subtitle, 'Smart design works better than simply attractive design. Every decision is guided by usability, storage efficiency, hygiene, workflow, ease of cleaning and structural integrity.'),
        about_phil1_title = COALESCE(about_phil1_title, 'Function Before Decoration'),
        about_phil1_desc = COALESCE(about_phil1_desc, 'Every element earns its place through daily usefulness — not just visual appeal.'),
        about_phil2_title = COALESCE(about_phil2_title, 'Timeless Over Trendy'),
        about_phil2_desc = COALESCE(about_phil2_desc, 'We design for a decade of relevance, not a season of applause.'),
        about_phil3_title = COALESCE(about_phil3_title, 'Smart Cost Optimization'),
        about_phil3_desc = COALESCE(about_phil3_desc, 'Premium where it matters, disciplined everywhere else.'),
        about_phil4_title = COALESCE(about_phil4_title, 'Precision in Execution'),
        about_phil4_desc = COALESCE(about_phil4_desc, 'Millimetre-level detailing, dimensionally accurate joinery, consistent finishes.'),
        about_phil5_title = COALESCE(about_phil5_title, 'Durability Matters'),
        about_phil5_desc = COALESCE(about_phil5_desc, 'Materials and construction chosen to withstand real, everyday use.'),
        about_phil6_title = COALESCE(about_phil6_title, 'Maintenance-Friendly'),
        about_phil6_desc = COALESCE(about_phil6_desc, 'Surfaces, hardware, and layouts that are easy to clean, service, and live with.'),
        about_diff_eyebrow = COALESCE(about_diff_eyebrow, 'The difference'),
        about_diff_title = COALESCE(about_diff_title, 'Traditional interior firms vs. the Elite Nest approach.'),
        about_diff_trad_title = COALESCE(about_diff_trad_title, 'Traditional firms'),
        about_diff_trad_subtitle = COALESCE(about_diff_trad_subtitle, 'Where projects usually fail'),
        about_diff_trad_points = COALESCE(about_diff_trad_points, 'Beautiful designs that lack practicality\nHidden costs and budget overruns\nMultiple vendors, multiple headaches\nDelays and inconsistent execution\nNo clear ownership or accountability\nSpaces designed for looks, not everyday living'),
        about_diff_elite_title = COALESCE(about_diff_elite_title, 'Elite Nest'),
        about_diff_elite_subtitle = COALESCE(about_diff_elite_subtitle, 'How we deliver differently'),
        about_diff_elite_points = COALESCE(about_diff_elite_points, 'Function-led designs with timeless aesthetics\nTransparent budgets with no hidden surprises\nSingle-point accountability from start to finish\nStructured execution with on-time delivery\nSmart sourcing for quality and value\nSpaces crafted for real-life comfort and performance'),
        about_spaces_eyebrow = COALESCE(about_spaces_eyebrow, 'Spaces we build'),
        about_spaces_title = COALESCE(about_spaces_title, 'Transforming Residential & Commercial Spaces'),
        about_spaces_desc = COALESCE(about_spaces_desc, 'From residences to commercial spaces, Elite Nest delivers end-to-end interior solutions—from concept and design to execution and handover, ensuring a seamless experience at every stage.'),
        about_mat_eyebrow = COALESCE(about_mat_eyebrow, 'Material & build'),
        about_mat_title = COALESCE(about_mat_title, 'Intelligent materials. Honest craftsmanship.'),
        about_mat_desc = COALESCE(about_mat_desc, 'We invest in premium materials where they change daily experience, and optimize elsewhere to protect your budget without compromising longevity.'),
        about_mat1_title = COALESCE(about_mat1_title, 'Contemporary Materials'),
        about_mat1_desc = COALESCE(about_mat1_desc, 'Modern engineered surfaces engineered for performance and longevity.'),
        about_mat2_title = COALESCE(about_mat2_title, 'Standardized Components'),
        about_mat2_desc = COALESCE(about_mat2_desc, 'Repeatable, tested systems that keep quality and cost predictable.'),
        about_mat3_title = COALESCE(about_mat3_title, 'Efficient Sourcing'),
        about_mat3_desc = COALESCE(about_mat3_desc, 'Direct vendor relationships, transparent margins, no hidden markups.'),
        about_mat4_title = COALESCE(about_mat4_title, 'Low-Maintenance Finishes'),
        about_mat4_desc = COALESCE(about_mat4_desc, 'Wear-resistant, easy-clean surfaces built for daily use.'),
        about_mat5_title = COALESCE(about_mat5_title, 'Structural Durability'),
        about_mat5_desc = COALESCE(about_mat5_desc, 'Joinery and carcasses built to last well beyond the warranty.'),
        about_mat6_title = COALESCE(about_mat6_title, 'Balanced Premium'),
        about_mat6_desc = COALESCE(about_mat6_desc, 'Investment placed where it changes daily experience the most.'),
        about_trust_eyebrow = COALESCE(about_trust_eyebrow, 'Trust'),
        about_trust_title = COALESCE(about_trust_title, 'Why clients choose Elite Nest.'),
        about_stat1_val = COALESCE(about_stat1_val, '100%'),
        about_stat1_label = COALESCE(about_stat1_label, 'Single-point accountability'),
        about_stat2_val = COALESCE(about_stat2_val, 'On-time'),
        about_stat2_label = COALESCE(about_stat2_label, 'Disciplined delivery'),
        about_stat3_val = COALESCE(about_stat3_val, 'Pan-India'),
        about_stat3_label = COALESCE(about_stat3_label, 'Turnkey execution'),
        about_stat4_val = COALESCE(about_stat4_val, 'Concept → Keys'),
        about_stat4_label = COALESCE(about_stat4_label, 'Fully in-house workflow'),
        about_trust_points = COALESCE(about_trust_points, 'Accountability at every stage\nDisciplined, on-site execution\nRealistic timelines, honestly communicated\nTransparent pricing and material choices\nBalanced aesthetics and cost\nQuality control systems, not promises\nPrecision detailing and finishing\nLong-term durability, built-in'),
        about_cta_eyebrow = COALESCE(about_cta_eyebrow, 'Built for real life'),
        about_cta_title = COALESCE(about_cta_title, 'Interiors that work better, last longer, and improve every day.'),
        about_cta_desc = COALESCE(about_cta_desc, 'Beautiful in photographs is easy. Beautiful to live and work in — for years — is the standard we build to.'),
        about_cta_button = COALESCE(about_cta_button, 'Book a Consultation')
      WHERE id = 1;
    `);

    console.log('About Us page settings columns successfully migrated!');
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
