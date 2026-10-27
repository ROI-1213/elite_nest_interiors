import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@168.119.64.101:5432/elite47';

async function setAdminUser() {
  const client = new pg.Client({
    connectionString,
    ssl: false,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    const adminAccounts = [
      { email: 'elitenestinteriors@gmail.com', password: 'elitenest@2026' },
      { email: 'admin@elitenest.com', password: 'elitenest@2026' },
    ];

    for (const acc of adminAccounts) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(acc.password, salt);

      const userRes = await client.query(
        `INSERT INTO public.users (email, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
         RETURNING id, email;`,
        [acc.email.toLowerCase(), hash]
      );

      const user = userRes.rows[0];
      await client.query(
        `INSERT INTO public.user_roles (user_id, role)
         VALUES ($1, 'admin')
         ON CONFLICT (user_id, role) DO NOTHING;`,
        [user.id]
      );
      console.log(`Admin verified for ${acc.email}`);
    }

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
