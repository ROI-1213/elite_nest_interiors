import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Status = "connecting" | "connected" | "error";

const TEST_TABLE =
  (import.meta.env.VITE_SUPABASE_TEST_TABLE as string | undefined) || "services";
const TEST_SELECT =
  (import.meta.env.VITE_SUPABASE_TEST_SELECT as string | undefined) || "*";
const TEST_LIMIT = Number(
  (import.meta.env.VITE_SUPABASE_TEST_LIMIT as string | undefined) || "1",
);
const TEST_HEAD =
  ((import.meta.env.VITE_SUPABASE_TEST_HEAD as string | undefined) || "true") === "true";

/**
 * Badge that verifies the Supabase connection AND a real anon-key read
 * against a known public table. Surfaces success or permission errors.
 */
export function SupabaseConnectionTest() {
  const [authStatus, setAuthStatus] = useState<Status>("connecting");
  const [dbStatus, setDbStatus] = useState<Status>("connecting");
  const [authMsg, setAuthMsg] = useState("");
  const [dbMsg, setDbMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;

      // 1. Auth ping (no RLS)
      try {
        const { error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          setAuthStatus("error");
          setAuthMsg(error.message);
        } else {
          setAuthStatus("connected");
          setAuthMsg(url ? new URL(url).host : "");
        }
      } catch (err) {
        if (!cancelled) {
          setAuthStatus("error");
          setAuthMsg((err as Error).message);
        }
      }

      // 2. Anon DB read against a known public table
      try {
        const client = supabase as unknown as {
          from: (t: string) => {
            select: (
              cols: string,
              opts?: { count?: "exact"; head?: boolean },
            ) => Promise<{
              data: unknown[] | null;
              count: number | null;
              error: { code?: string; message: string } | null;
            }> & {
              limit: (n: number) => Promise<{
                data: unknown[] | null;
                count: number | null;
                error: { code?: string; message: string } | null;
              }>;
            };
          };
        };
        const query = client.from(TEST_TABLE).select(TEST_SELECT, {
          count: "exact",
          head: TEST_HEAD,
        });
        const { data, count, error } = await (TEST_HEAD
          ? query
          : query.limit(TEST_LIMIT));
        if (cancelled) return;
        if (error) {
          setDbStatus("error");
          setDbMsg(`${error.code ?? ""} ${error.message}`.trim());
        } else {
          setDbStatus("connected");
          const rows = count ?? (Array.isArray(data) ? data.length : 0);
          setDbMsg(`${TEST_TABLE}: ${rows} row${rows === 1 ? "" : "s"}`);
        }
      } catch (err) {
        if (!cancelled) {
          setDbStatus("error");
          setDbMsg((err as Error).message);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dot = (s: Status) =>
    s === "connected"
      ? "bg-emerald-500"
      : s === "error"
        ? "bg-red-500"
        : "bg-amber-500";

  const line = (label: string, s: Status, msg: string) =>
    s === "connecting"
      ? `${label}: checking…`
      : s === "connected"
        ? `${label} OK${msg ? ` · ${msg}` : ""}`
        : `${label} ERROR: ${msg}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex flex-col gap-1 rounded-lg border border-border bg-background/90 px-3 py-2 text-xs shadow-md backdrop-blur max-w-[90vw]"
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot(authStatus)}`} />
        <span className="text-foreground/80">
          {line("Supabase", authStatus, authMsg)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot(dbStatus)}`} />
        <span className="text-foreground/80 break-all">
          {line("DB read", dbStatus, dbMsg)}
        </span>
      </div>
    </div>
  );
}
