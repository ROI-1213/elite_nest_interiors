import pg from 'pg';
import crypto from 'node:crypto';

const connectionString = process.env.DATABASE_URL || 'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@168.119.64.101:5432/elite47';
const JWT_SECRET = process.env.JWT_SECRET || 'elite_nest_secret_key_2026_pg_auth';

async function testAllAdminSaves() {
  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log('✓ Connected to PostgreSQL at 168.119.64.101:5432');

  let passed = 0;
  let failed = 0;

  function check(name, success, info = '') {
    if (success) {
      passed++;
      console.log(`  [PASS] ${name} ${info}`);
    } else {
      failed++;
      console.error(`  [FAIL] ${name} ${info}`);
    }
  }

  // 1. SITE SETTINGS SAVE TEST
  console.log('\n--- 1. Testing Site Settings Save (Home / About / Contact / Settings) ---');
  try {
    const orig = await client.query('SELECT * FROM public.site_settings WHERE id = 1');
    const row = orig.rows[0];
    check('Load site_settings id=1', !!row, `(Phone: ${row.phone})`);

    // Test updating a field
    const testTagline = `Luxury Interiors - Tested ${Date.now()}`;
    await client.query(
      'UPDATE public.site_settings SET tagline = $1, updated_at = NOW() WHERE id = 1',
      [testTagline]
    );
    const updated = await client.query('SELECT tagline FROM public.site_settings WHERE id = 1');
    check('Update tagline in site_settings', updated.rows[0].tagline === testTagline);

    // Restore original tagline
    await client.query('UPDATE public.site_settings SET tagline = $1 WHERE id = 1', [row.tagline]);
    check('Restore original tagline', true);
  } catch (err) {
    check('Site settings update error', false, err.message);
  }

  // 2. GALLERY ITEMS CRUD TEST
  console.log('\n--- 2. Testing Gallery Item Save & Delete ---');
  let testGalId = null;
  try {
    const testGal = await client.query(
      `INSERT INTO public.gallery_items (title, category, image_url, description, location, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, 999, true) RETURNING id`,
      ['Test Gallery Villa', 'living', 'https://example.com/test.jpg', 'Modern villa design', 'Bengaluru']
    );
    testGalId = testGal.rows[0].id;
    check('Create Gallery Item', !!testGalId, `(ID: ${testGalId})`);

    // Update gallery item
    await client.query('UPDATE public.gallery_items SET title = $1 WHERE id = $2', ['Updated Villa Title', testGalId]);
    const gCheck = await client.query('SELECT title FROM public.gallery_items WHERE id = $1', [testGalId]);
    check('Update Gallery Item', gCheck.rows[0].title === 'Updated Villa Title');

    // Delete gallery item
    await client.query('DELETE FROM public.gallery_items WHERE id = $1', [testGalId]);
    const gDel = await client.query('SELECT id FROM public.gallery_items WHERE id = $1', [testGalId]);
    check('Delete Gallery Item', gDel.rows.length === 0);
  } catch (err) {
    check('Gallery operations error', false, err.message);
  }

  // 3. TESTIMONIALS CRUD TEST
  console.log('\n--- 3. Testing Testimonials Save & Delete ---');
  let testTestimId = null;
  try {
    const tInsert = await client.query(
      `INSERT INTO public.testimonials (client_name, project_type, location, rating, testimonial, client_photo_url, display_order, is_featured, is_active)
       VALUES ($1, $2, $3, 5, $4, $5, 999, false, true) RETURNING id`,
      ['Mr. Amit Sharma', '4BHK Villa Interior', 'Whitefield', 'Outstanding craftsmanship by Elite Nest!', null]
    );
    testTestimId = tInsert.rows[0].id;
    check('Create Testimonial', !!testTestimId, `(ID: ${testTestimId})`);

    // Update testimonial
    await client.query('UPDATE public.testimonials SET client_name = $1 WHERE id = $2', ['Mr. Amit S. (Updated)', testTestimId]);
    const tCheck = await client.query('SELECT client_name FROM public.testimonials WHERE id = $1', [testTestimId]);
    check('Update Testimonial', tCheck.rows[0].client_name === 'Mr. Amit S. (Updated)');

    // Delete testimonial
    await client.query('DELETE FROM public.testimonials WHERE id = $1', [testTestimId]);
    const tDel = await client.query('SELECT id FROM public.testimonials WHERE id = $1', [testTestimId]);
    check('Delete Testimonial', tDel.rows.length === 0);
  } catch (err) {
    check('Testimonial operations error', false, err.message);
  }

  // 4. VIDEO TESTIMONIALS CRUD TEST
  console.log('\n--- 4. Testing Video Testimonials Save & Delete ---');
  let testVidId = null;
  try {
    const vInsert = await client.query(
      `INSERT INTO public.video_testimonials (title, client_name, location, video_url, thumbnail_url, duration, display_order, is_featured, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, 999, false, true) RETURNING id`,
      ['Villa Walkthrough Review', 'Suresh Reddy', 'Koramangala', 'https://youtube.com/watch?v=123', null, '2:45']
    );
    testVidId = vInsert.rows[0].id;
    check('Create Video Testimonial', !!testVidId, `(ID: ${testVidId})`);

    // Update video testimonial
    await client.query('UPDATE public.video_testimonials SET title = $1 WHERE id = $2', ['Updated Video Review', testVidId]);
    const vCheck = await client.query('SELECT title FROM public.video_testimonials WHERE id = $1', [testVidId]);
    check('Update Video Testimonial', vCheck.rows[0].title === 'Updated Video Review');

    // Delete video testimonial
    await client.query('DELETE FROM public.video_testimonials WHERE id = $1', [testVidId]);
    const vDel = await client.query('SELECT id FROM public.video_testimonials WHERE id = $1', [testVidId]);
    check('Delete Video Testimonial', vDel.rows.length === 0);
  } catch (err) {
    check('Video testimonial operations error', false, err.message);
  }

  // 5. STORAGE OBJECTS (IMAGE UPLOAD) TEST
  console.log('\n--- 5. Testing Image Upload to PostgreSQL storage_objects ---');
  const testFileName = `test-upload-${Date.now()}.png`;
  try {
    // 1x1 test pixel buffer
    const testBuf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    const sInsert = await client.query(
      `INSERT INTO public.storage_objects (bucket_id, filename, mime_type, file_data)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['general', testFileName, 'image/png', testBuf]
    );
    check('Store image binary in PostgreSQL', !!sInsert.rows[0].id, `(filename: ${testFileName})`);

    // Retrieve and verify data integrity
    const sFetch = await client.query(
      `SELECT mime_type, file_data FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2`,
      ['general', testFileName]
    );
    check('Retrieve stored image', sFetch.rows.length > 0 && sFetch.rows[0].file_data.length === testBuf.length);

    // Delete test image
    await client.query('DELETE FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2', ['general', testFileName]);
    const sDel = await client.query('SELECT id FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2', ['general', testFileName]);
    check('Clean up test storage object', sDel.rows.length === 0);
  } catch (err) {
    check('Storage upload test error', false, err.message);
  }

  // 6. ENQUIRIES STATUS & NOTES TEST
  console.log('\n--- 6. Testing Enquiry Status & Admin Notes Update ---');
  try {
    const eInsert = await client.query(
      `INSERT INTO public.enquiries (name, email, phone, message, status)
       VALUES ($1, $2, $3, $4, 'new') RETURNING id`,
      ['Test Client', 'client@test.com', '+91 99999 88888', 'Villa design enquiry']
    );
    const eId = eInsert.rows[0].id;
    check('Create Enquiry', !!eId);

    await client.query('UPDATE public.enquiries SET status = $1, admin_notes = $2 WHERE id = $3', ['contacted', 'Client meeting scheduled', eId]);
    const eCheck = await client.query('SELECT status, admin_notes FROM public.enquiries WHERE id = $1', [eId]);
    check('Update Enquiry Status & Notes', eCheck.rows[0].status === 'contacted' && eCheck.rows[0].admin_notes.includes('meeting'));

    await client.query('DELETE FROM public.enquiries WHERE id = $1', [eId]);
    const eDel = await client.query('SELECT id FROM public.enquiries WHERE id = $1', [eId]);
    check('Delete Enquiry', eDel.rows.length === 0);
  } catch (err) {
    check('Enquiry update error', false, err.message);
  }

  await client.end();

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');
  if (failed > 0) process.exit(1);
}

testAllAdminSaves().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
