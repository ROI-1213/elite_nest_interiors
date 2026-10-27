import pg from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@localhost:5432/elite47';

async function inspect() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL:', connectionString.replace(/:[^:@]+@/, ':***@'));

    const tables = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
    );

    console.log('\n--- PostgreSQL Tables & Row Counts ---');
    for (const r of tables.rows) {
      const res = await client.query(`SELECT count(*) FROM public."${r.table_name}"`);
      console.log(`  ✓ ${r.table_name}: ${res.rows[0].count} rows`);
    }

    console.log('\n--- Storage Buckets ---');
    const buckets = await client.query(`SELECT * FROM public.storage_buckets`);
    for (const b of buckets.rows) {
      console.log(`  • Bucket: ${b.id} (${b.name}) - Public: ${b.public}`);
    }

    console.log('\n--- Admin Users ---');
    const users = await client.query(
      `SELECT u.id, u.email, r.role, u.created_at
       FROM public.users u
       LEFT JOIN public.user_roles r ON u.id = r.user_id`
    );
    for (const u of users.rows) {
      console.log(`  • User: ${u.email} [Role: ${u.role}] (ID: ${u.id})`);
    }

  } finally {
    await client.end();
  }
}

inspect().catch(console.error);
