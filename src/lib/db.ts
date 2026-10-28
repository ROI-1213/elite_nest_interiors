import type { Pool as PgPoolType, PoolConfig, QueryResult, QueryResultRow } from "pg";
import { createRequire } from "node:module";

// Resilient PostgreSQL module loader supporting CJS, ESM, Vite SSR, and fallback
let PgPoolConstructor: any = null;

try {
  const require = createRequire(import.meta.url);
  const pg = require("pg");
  PgPoolConstructor = pg.Pool || pg.default?.Pool || pg;
} catch {
  try {
    const pg = await import("pg");
    PgPoolConstructor = (pg as any).Pool || (pg as any).default?.Pool || (pg as any).default;
  } catch (e2) {
    console.error("[PostgreSQL] 'pg' module resolution notice:", e2);
  }
}

// Fallback dummy pool to prevent fatal server crash if 'pg' is temporarily uninstalled
class SafeFallbackPool {
  options: any = {};
  constructor(public config: any) {
    this.options = config || {};
  }
  on() {
    return this;
  }
  async query() {
    throw new Error(
      "PostgreSQL client 'pg' could not be loaded. Please ensure dependencies are installed via npm install."
    );
  }
  async connect() {
    throw new Error(
      "PostgreSQL client 'pg' could not be loaded. Please ensure dependencies are installed via npm install."
    );
  }
  async end() {}
}

const PoolClass = PgPoolConstructor || SafeFallbackPool;
export type Pool = PgPoolType;

// Global declaration for singleton pool in development/server environments
declare global {
  // eslint-disable-next-line no-var
  var __pgPoolInstance: Pool | undefined;
  // eslint-disable-next-line no-var
  var __pgFallbackPoolInstance: Pool | undefined;
}

// Ensure .env is populated if run under bare Node.js
try {
  if (!process.env.DATABASE_URL && typeof process !== "undefined" && process.cwd) {
    const fs = createRequire(import.meta.url)("node:fs");
    const path = createRequire(import.meta.url)("node:path");
    const envFile = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const k = trimmed.slice(0, eqIdx).trim();
          const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"](.*)['"]$/, "$1");
          if (k && !process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    }
  }
} catch {
  // Silent fallback
}

function buildPoolConfig(hostOverride?: string): PoolConfig {
  let connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRESQL_URL;

  const isCloudServerless = Boolean(
    process.env.VERCEL ||
    process.env.NOW_REGION ||
    process.env.AWS_REGION ||
    process.env.NETLIFY ||
    process.env.CF_PAGES
  );

  const defaultHost = "127.0.0.1";
  const targetHost = hostOverride || process.env.DB_HOST || defaultHost;

  const sslEnabled =
    process.env.DB_SSL === "true" ||
    process.env.PGSSL === "true" ||
    (connectionString ? connectionString.includes("sslmode=require") : false);

  return connectionString
    ? {
        connectionString,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: parseInt(process.env.DB_POOL_MAX || "10", 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 4000,
      }
    : {
        host: targetHost,
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
        connectionTimeoutMillis: 4000,
      };
}

function createPool(hostOverride?: string): Pool {
  const poolConfig = buildPoolConfig(hostOverride);
  const p = new PoolClass(poolConfig) as Pool;
  p.on("error", (err: any) => {
    console.error("Unexpected PostgreSQL client error:", err?.message || err);
  });
  return p;
}

let primaryPool: Pool = globalThis.__pgPoolInstance ?? createPool();
let fallbackPool: Pool | null = globalThis.__pgFallbackPoolInstance ?? null;

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPoolInstance = primaryPool;
}

function getSecondaryPool(): Pool {
  if (!fallbackPool) {
    const curHost =
      (primaryPool as any).options?.host ||
      ((primaryPool as any).options?.connectionString?.includes("127.0.0.1") ? "127.0.0.1" : "localhost");
    const altHost = curHost === "127.0.0.1" ? "localhost" : "127.0.0.1";
    fallbackPool = createPool(altHost);
    if (process.env.NODE_ENV !== "production") {
      globalThis.__pgFallbackPoolInstance = fallbackPool;
    }
  }
  return fallbackPool;
}

export const pool: Pool = primaryPool;

function isConnectionError(err: any): boolean {
  const code = err?.code;
  const msg = (err?.message || "").toLowerCase();
  return (
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === "ENOTFOUND" ||
    code === "EHOSTUNREACH" ||
    code === "ECONNRESET" ||
    msg.includes("connection terminated") ||
    msg.includes("timeout") ||
    msg.includes("refused")
  );
}

export async function query<R extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<R>> {
  const start = Date.now();
  try {
    const res = await primaryPool.query<R>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("[PostgreSQL Query]", { text, rows: res.rowCount, duration: `${duration}ms` });
    }
    return res;
  } catch (err: any) {
    if (isConnectionError(err)) {
      console.warn("[PostgreSQL Primary Failed, attempting failover...]", err.message);
      try {
        const sec = getSecondaryPool();
        const res = await sec.query<R>(text, params);
        primaryPool = sec;
        return res;
      } catch (secErr: any) {
        console.error("[PostgreSQL Failover also failed]:", secErr.message);
      }
    }
    console.error("[PostgreSQL Query Error]:", err?.message || err);
    throw new Error(typeof err?.message === "string" ? err.message : "Database query error");
  }
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const res = await query(text, params);
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
