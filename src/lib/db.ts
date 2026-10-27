import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";

// Global declaration for singleton pool in development/server environments
declare global {
  // eslint-disable-next-line no-var
  var __pgPoolInstance: Pool | undefined;
}

function createPool(): Pool {
  let connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRESQL_URL;

  // When running on Vercel, cloud serverless, or production, route to the live PostgreSQL server
  const isCloudServerless = Boolean(
    process.env.VERCEL ||
    process.env.NOW_REGION ||
    process.env.AWS_REGION ||
    process.env.NETLIFY ||
    process.env.CF_PAGES ||
    process.env.NODE_ENV === "production"
  );

  if (connectionString && isCloudServerless) {
    connectionString = connectionString
      .replace("@localhost:", "@168.119.64.101:")
      .replace("@127.0.0.1:", "@168.119.64.101:");
  }

  const defaultHost = isCloudServerless
    ? "168.119.64.101"
    : (process.env.PGHOST || "localhost");

  const configuredHost = process.env.DB_HOST;
  const host = configuredHost
    ? (isCloudServerless && (configuredHost === "localhost" || configuredHost === "127.0.0.1")
        ? "168.119.64.101"
        : configuredHost)
    : defaultHost;

  const sslEnabled =
    process.env.DB_SSL === "true" ||
    process.env.PGSSL === "true" ||
    (connectionString ? connectionString.includes("sslmode=require") : false);

  const poolConfig: PoolConfig = connectionString
    ? {
        connectionString,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: parseInt(process.env.DB_POOL_MAX || "10", 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        host,
        port: parseInt(process.env.DB_PORT || process.env.PGPORT || "5432", 10),
        database: process.env.DB_NAME || process.env.PGDATABASE || "elite47",
        user: process.env.DB_USER || process.env.PGUSER || "elite47",
        password:
          process.env.DB_PASSWORD ||
          process.env.PGPASSWORD ||
          "z74zT9hvpAYamMsKjkbG5Guhm",
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: parseInt(process.env.DB_POOL_MAX || "10", 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      };

  const pool = new Pool(poolConfig);

  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client:", err?.message || err);
  });

  return pool;
}

export const pool: Pool = globalThis.__pgPoolInstance ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPoolInstance = pool;
}

export async function query<R extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<R>> {
  const start = Date.now();
  try {
    const res = await pool.query<R>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("[PostgreSQL Query]", { text, rows: res.rowCount, duration: `${duration}ms` });
    }
    return res;
  } catch (err: any) {
    console.error("[PostgreSQL Query Error]:", err?.message || err);
    throw new Error(typeof err?.message === "string" ? err.message : "Database query error");
  }
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const res = await pool.query(text, params);
    return res.rows as T[];
  } catch (err: any) {
    console.error("[PostgreSQL Query Error]:", err?.message || err);
    throw new Error(typeof err?.message === "string" ? err.message : "Database error");
  }
}

export async function queryOneDb<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await queryDb<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

export function getDbPool(): Pool {
  return pool;
}

export async function testDatabaseConnection(): Promise<{
  success: boolean;
  database?: string;
  serverTime?: string;
  version?: string;
  error?: string;
}> {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(
        "SELECT current_database() as database, NOW() as server_time, version() as version;"
      );
      const row = res.rows[0];
      return {
        success: true,
        database: row.database,
        serverTime: row.server_time,
        version: row.version,
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("PostgreSQL connection check failed:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

export default {
  query,
  pool,
  queryDb,
  queryOneDb,
  getDbPool,
  testDatabaseConnection,
};
