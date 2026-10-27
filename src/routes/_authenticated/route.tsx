import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { verifyTokenServerFn } from "@/lib/server-functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Check local JWT token verified directly with PostgreSQL database
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("elite_admin_token");
      if (token) {
        try {
          const verified = await verifyTokenServerFn({ data: { token } });
          if (verified && verified.isAdmin) {
            return {
              user: verified.user,
              isAdmin: true,
            };
          }
        } catch (err) {
          console.warn("PostgreSQL token verification error:", err);
          localStorage.removeItem("elite_admin_token");
        }
      }
    }

    // Not authenticated -> redirect to admin login
    if (typeof window !== "undefined") {
      localStorage.removeItem("elite_admin_token");
    }
    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
