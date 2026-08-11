import pg from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://elite47:z74zT9hvpAYamMsKjkbG5Guhm@168.119.64.101:5432/elite47';

let pool: pg.Pool | undefined;

export function getDbPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }
  return pool;
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getDbPool();
  const res = await p.query(text, params);
  return res.rows as T[];
}

export async function queryOneDb<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await queryDb<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}
