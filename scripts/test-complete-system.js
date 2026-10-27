import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@localhost:5432/elite47';

const JWT_SECRET = process.env.JWT_SECRET || 'elite_nest_secret_key_2026_pg_auth';

async function runFullTest() {
  const client = new pg.Client({ connectionString });
  const report = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
  };

  function assert(condition, testName, errorDetails = '') {
    report.total++;
    if (condition) {
      report.passed++;
      console.log(`  [PASS] ${testName}`);
    } else {
      report.failed++;
      console.error(`  [FAIL] ${testName}: ${errorDetails}`);
      report.errors.push(`${testName}: ${errorDetails}`);
    }
  }

  console.log('========================================================');
  console.log('STARTING COMPLETE SYSTEM & DATABASE INTEGRATION TEST');
  console.log('PostgreSQL Target: localhost:5432 / elite47');
  console.log('========================================================\n');

  try {
    // 1. Connection
    console.log('--- 1. Database Connection ---');
    await client.connect();
    assert(true, 'Connect to PostgreSQL server at localhost:5432');

    // 2. Tables Check
    console.log('\n--- 2. Schema & Tables Verification ---');
    const requiredTables = [
      'users',
      'user_roles',
      'service_categories',
      'services',
      'gallery_items',
      'testimonials',
      'video_testimonials',
      'enquiries',
      'site_settings',
      'storage_buckets',
      'storage_objects',
    ];

    const tablesRes = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const existingTables = new Set(tablesRes.rows.map((r) => r.table_name));

    for (const tbl of requiredTables) {
      assert(existingTables.has(tbl), `Table exists: public.${tbl}`);
    }

    // 3. Admin Authentication
    console.log('\n--- 3. Admin Authentication & Role Security ---');
    const testEmail = 'elitenestinteriors@gmail.com';
    const testPass = 'elitenest@2026';

    const userRes = await client.query(
      `SELECT u.id, u.email, u.password_hash, r.role
       FROM public.users u
       LEFT JOIN public.user_roles r ON u.id = r.user_id
       WHERE u.email = $1`,
      [testEmail]
    );

    assert(userRes.rows.length > 0, `User exists: ${testEmail}`);
    const adminUser = userRes.rows[0];

    const passMatch = await bcrypt.compare(testPass, adminUser.password_hash);
    assert(passMatch === true, `Password verification for ${testEmail}`);
    assert(adminUser.role === 'admin', `Admin role assigned in user_roles: role=${adminUser.role}`);

    // Test JWT creation and verification
    const token = jwt.sign(
      { userId: adminUser.id, email: adminUser.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    assert(typeof token === 'string' && token.length > 20, 'JWT Token successfully signed');

    const decoded = jwt.verify(token, JWT_SECRET);
    assert(decoded.userId === adminUser.id && decoded.isAdmin === true, 'JWT Token payload verified');

    // Test rejection of wrong password
    const badPassMatch = await bcrypt.compare('WrongPassword@123', adminUser.password_hash);
    assert(badPassMatch === false, 'Security: Rejects incorrect password');

    // 4. Admin CRUD Operations Test
    console.log('\n--- 4. Admin Content Operations (CRUD) ---');

    // A. Service Categories
    console.log('Testing Categories CRUD:');
    const catSlug = `test-cat-${Date.now()}`;
    const insertCat = await client.query(
      `INSERT INTO public.service_categories (name, slug, description, display_order, is_active)
       VALUES ($1, $2, $3, 99, true) RETURNING id`,
      ['Test Penthouse Category', catSlug, 'Category for testing']
    );
    const catId = insertCat.rows[0].id;
    assert(!!catId, `Create Category (ID: ${catId})`);

    const updateCat = await client.query(
      `UPDATE public.service_categories SET name = $1 WHERE id = $2 RETURNING name`,
      ['Updated Test Penthouse Category', catId]
    );
    assert(updateCat.rows[0].name === 'Updated Test Penthouse Category', 'Update Category');

    await client.query(`DELETE FROM public.service_categories WHERE id = $1`, [catId]);
    const checkCat = await client.query(`SELECT id FROM public.service_categories WHERE id = $1`, [catId]);
    assert(checkCat.rows.length === 0, 'Delete Category');

    // B. Services
    console.log('Testing Services CRUD:');
    const servSlug = `test-service-${Date.now()}`;
    const insertServ = await client.query(
      `INSERT INTO public.services (title, slug, short_description, description, display_order, is_active)
       VALUES ($1, $2, $3, $4, 99, true) RETURNING id`,
      ['Test Architectural Acoustics', servSlug, 'Short desc', 'Full description']
    );
    const servId = insertServ.rows[0].id;
    assert(!!servId, `Create Service (ID: ${servId})`);

    const fetchServ = await client.query(`SELECT title, slug FROM public.services WHERE slug = $1`, [servSlug]);
    assert(fetchServ.rows.length > 0 && fetchServ.rows[0].title === 'Test Architectural Acoustics', 'Query Service by slug');

    await client.query(`DELETE FROM public.services WHERE id = $1`, [servId]);
    const checkServ = await client.query(`SELECT id FROM public.services WHERE id = $1`, [servId]);
    assert(checkServ.rows.length === 0, 'Delete Service');

    // C. Gallery Items & Image Persistence
    console.log('Testing Gallery Items CRUD:');
    const insertGal = await client.query(
      `INSERT INTO public.gallery_items (title, category, description, image_url, display_order, is_active)
       VALUES ($1, $2, $3, $4, 99, true) RETURNING id`,
      ['Test Luxury Villa View', 'Living Rooms', 'Test description', 'https://example.com/test.jpg']
    );
    const galId = insertGal.rows[0].id;
    assert(!!galId, `Create Gallery Item (ID: ${galId})`);

    const updateGal = await client.query(
      `UPDATE public.gallery_items SET title = $1 WHERE id = $2 RETURNING title`,
      ['Updated Luxury Villa View', galId]
    );
    assert(updateGal.rows[0].title === 'Updated Luxury Villa View', 'Update Gallery Item');

    await client.query(`DELETE FROM public.gallery_items WHERE id = $1`, [galId]);
    const checkGal = await client.query(`SELECT id FROM public.gallery_items WHERE id = $1`, [galId]);
    assert(checkGal.rows.length === 0, 'Delete Gallery Item');

    // D. Testimonials
    console.log('Testing Testimonials CRUD:');
    const insertTestim = await client.query(
      `INSERT INTO public.testimonials (author_name, author_location, rating, content, service_type, display_order, is_active)
       VALUES ($1, $2, 5, $3, $4, 99, true) RETURNING id`,
      ['Dr. Rajesh Kumar', 'Indiranagar, Bengaluru', 'Flawless design and execution!', 'Turnkey Interior']
    );
    const testimId = insertTestim.rows[0].id;
    assert(!!testimId, `Create Testimonial (ID: ${testimId})`);

    await client.query(`DELETE FROM public.testimonials WHERE id = $1`, [testimId]);
    const checkTestim = await client.query(`SELECT id FROM public.testimonials WHERE id = $1`, [testimId]);
    assert(checkTestim.rows.length === 0, 'Delete Testimonial');

    // E. Enquiries
    console.log('Testing Enquiries Submission & Status Management:');
    const insertEnquiry = await client.query(
      `INSERT INTO public.enquiries (name, phone, email, message, service_title, source, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new') RETURNING id`,
      ['Vikram Malhotra', '+91 98450 12345', 'vikram@example.com', 'Looking for villa interior design', 'Turnkey Interior Solutions', 'website-test']
    );
    const enquiryId = insertEnquiry.rows[0].id;
    assert(!!enquiryId, `Submit Enquiry (ID: ${enquiryId})`);

    // Update status to in_progress
    const updateEnquiryStatus = await client.query(
      `UPDATE public.enquiries SET status = 'in_progress', admin_notes = 'Called client, meeting scheduled on Friday.' WHERE id = $1 RETURNING status, admin_notes`,
      [enquiryId]
    );
    assert(updateEnquiryStatus.rows[0].status === 'in_progress', 'Update Enquiry Status to in_progress');
    assert(updateEnquiryStatus.rows[0].admin_notes.includes('Friday'), 'Update Enquiry Admin Notes');

    await client.query(`DELETE FROM public.enquiries WHERE id = $1`, [enquiryId]);
    const checkEnquiry = await client.query(`SELECT id FROM public.enquiries WHERE id = $1`, [enquiryId]);
    assert(checkEnquiry.rows.length === 0, 'Delete Enquiry');

    // 5. PostgreSQL Native Object Storage Test
    console.log('\n--- 5. PostgreSQL Native Storage Buckets & Binary Blobs ---');
    const testBucket = 'gallery';
    const testFilename = `test-image-${Date.now()}.png`;
    const testMime = 'image/png';
    // 1x1 pixel PNG
    const testPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const testBuffer = Buffer.from(testPngBase64, 'base64');

    const insertStorage = await client.query(
      `INSERT INTO public.storage_objects (bucket_id, filename, mime_type, file_data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (bucket_id, filename) DO UPDATE SET file_data = EXCLUDED.file_data
       RETURNING id, filename`,
      [testBucket, testFilename, testMime, testBuffer]
    );
    assert(!!insertStorage.rows[0].id, `Store Binary Image in PostgreSQL: ${testFilename}`);

    const retrieveStorage = await client.query(
      `SELECT bucket_id, filename, mime_type, file_data FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2`,
      [testBucket, testFilename]
    );
    assert(retrieveStorage.rows.length > 0, 'Retrieve Binary Image from PostgreSQL storage_objects');
    assert(retrieveStorage.rows[0].mime_type === testMime, `Verify Mime-Type: ${retrieveStorage.rows[0].mime_type}`);
    assert(retrieveStorage.rows[0].file_data.length === testBuffer.length, `Verify Binary Byte Length (${retrieveStorage.rows[0].file_data.length} bytes)`);

    // Clean up test storage item
    await client.query(`DELETE FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2`, [testBucket, testFilename]);
    const checkStorage = await client.query(`SELECT id FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2`, [testBucket, testFilename]);
    assert(checkStorage.rows.length === 0, 'Clean up test storage object');

    // 6. Site Settings
    console.log('\n--- 6. Site Settings Verification ---');
    const settingsRes = await client.query(`SELECT business_name, email, phone, address FROM public.site_settings WHERE id = 1`);
    assert(settingsRes.rows.length > 0, 'Site Settings row id=1 exists');
    assert(settingsRes.rows[0].business_name === 'Elite Nest Interiors', `Business Name: ${settingsRes.rows[0].business_name}`);
    console.log(`  • Phone: ${settingsRes.rows[0].phone}`);
    console.log(`  • Email: ${settingsRes.rows[0].email}`);
    console.log(`  • Address: ${settingsRes.rows[0].address}`);

  } catch (err) {
    assert(false, 'General Execution Exception', err.message);
  } finally {
    await client.end();
  }

  console.log('\n========================================================');
  console.log(`TEST SUMMARY: ${report.passed}/${report.total} PASSED (${report.failed} FAILED)`);
  console.log('========================================================\n');

  if (report.failed > 0) {
    console.error('Errors found:');
    report.errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED SUCCESSFULLY! No errors found.');
  }
}

runFullTest();
