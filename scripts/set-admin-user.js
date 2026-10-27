import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@localhost:5432/elite47';

async function setAdminUser() {
  const client = new pg.Client({
    connectionString,
    ssl: false,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    const adminEmail = 'elitenestinteriors@gmail.com';
    const adminPassword = 'elitenest@2026';

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    const userRes = await client.query(
      `INSERT INTO public.users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id, email;`,
      [adminEmail.toLowerCase(), hash]
    );

    const user = userRes.rows[0];
    console.log('Admin user updated/created:', user);

    await client.query(
      `INSERT INTO public.user_roles (user_id, role)
       VALUES ($1, 'admin')
       ON CONFLICT (user_id, role) DO NOTHING;`,
      [user.id]
    );

    console.log('Admin role confirmed for user:', user.email);

    // List all admin users
    const allUsers = await client.query(
      `SELECT u.id, u.email, r.role FROM public.users u
       LEFT JOIN public.user_roles r ON u.id = r.user_id`
    );
    console.log('Current users in DB:', allUsers.rows);

  } catch (err) {
    console.error('Error setting admin user:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setAdminUser();
