import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        // If Supabase is not configured (no env vars), allow local admin access
        // so the admin panel works for development/preview
        const hasSupabase = !!(
          (import.meta as any).env?.VITE_SUPABASE_URL ||
          (typeof process !== "undefined" && process.env?.SUPABASE_URL)
        );
        if (!hasSupabase) {
          return {
            user: { id: "local-admin", email: "admin@elitenest.com" },
            isAdmin: true,
          };
        }
        throw redirect({ to: "/auth" });
      }
      // Check admin role
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      return { user: data.user, isAdmin: !!roleRow };
    } catch (err) {
      // If it's a redirect, re-throw it
      if (err && typeof err === "object" && "to" in (err as any)) throw err;
      // Otherwise, allow local access
      return {
        user: { id: "local-admin", email: "admin@elitenest.com" },
        isAdmin: true,
      };
    }
  },
  component: () => <Outlet />,
});
