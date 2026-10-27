import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export function getStoredAuth(): {
  user: { id: string; email: string };
  isAdmin: boolean;
} | null {
  if (typeof window === "undefined") return null;
  try {
    let token = localStorage.getItem("elite_admin_token");
    if (!token) {
      // Check cookie fallback if localStorage was cleared or partitioned
      const match = document.cookie.match(/(?:^|;\s*)elite_admin_token=([^;]+)/);
      if (match && match[1]) {
        token = decodeURIComponent(match[1]);
        try {
          localStorage.setItem("elite_admin_token", token);
        } catch {}
      }
    }
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.removeItem("elite_admin_token");
      document.cookie = "elite_admin_token=; path=/; max-age=0; SameSite=Lax;";
      return null;
    }
    const payload = JSON.parse(atob(parts[1]));
    if (!payload || !payload.userId || !payload.email) {
      localStorage.removeItem("elite_admin_token");
      document.cookie = "elite_admin_token=; path=/; max-age=0; SameSite=Lax;";
      return null;
    }
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("elite_admin_token");
      document.cookie = "elite_admin_token=; path=/; max-age=0; SameSite=Lax;";
      return null;
    }
    return {
      user: { id: payload.userId, email: payload.email },
      isAdmin: Boolean(payload.isAdmin),
    };
  } catch {
    try {
      localStorage.removeItem("elite_admin_token");
      document.cookie = "elite_admin_token=; path=/; max-age=0; SameSite=Lax;";
    } catch {}
    return null;
  }
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ location }) => {
    // During SSR or outside browser, return safe default without throwing redirect
    if (typeof window === "undefined") {
      return {
        user: { id: "", email: "" },
        isAdmin: false,
      };
    }

    const auth = getStoredAuth();
    if (auth && auth.isAdmin) {
      return {
        user: auth.user,
        isAdmin: true,
      };
    }

    // Never redirect to /auth if already on /auth
    if (location.pathname !== "/auth") {
      throw redirect({ to: "/auth" });
    }

    return {
      user: { id: "", email: "" },
      isAdmin: false,
    };
  },
  component: () => <Outlet />,
});
