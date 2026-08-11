import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Elite Nest Interior" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@elitenest.com");
  const [password, setPassword] = useState("Admin@123456");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.session) {
        setBusy(false);
        toast.success("Welcome back.");
        navigate({ to: "/admin" });
        return;
      }
    } catch (_) {}

    setBusy(false);
    toast.error("Invalid email or password. Please try again.");
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#B8894D]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#B8894D]/10 blur-3xl pointer-events-none" />

      {/* Main Standalone Card */}
      <div className="w-full max-w-md rounded-3xl border border-[#E5D4BD] bg-white p-8 md:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          {/* Logo in Dark Luxury Pill for 100% High-Contrast Clarity */}
          <Link to="/" className="inline-block mb-4 overflow-visible">
            <div className="mx-auto flex h-20 w-full max-w-[280px] items-center justify-center rounded-2xl bg-[#1A1410] px-6 py-3 border border-[#C49A5A]/50 shadow-md transition-transform hover:scale-105">
              <img
                src={logo}
                alt="Elite Nest Interiors"
                className="h-14 w-auto object-contain filter drop-shadow-md"
              />
            </div>
          </Link>

          <div>
            <span className="inline-block rounded-full bg-[#B8894D]/15 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8894D]">
              Admin Control Panel
            </span>
          </div>
          <h1 className="mt-4 font-serif text-3xl text-[#221912]">
            Sign in
          </h1>
          <p className="mt-2 text-xs text-[#6F6257]">
            Access the admin dashboard to manage your website content.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#221912] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elitenest.com"
              className="w-full rounded-xl border border-[#E5D4BD] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#B8894D] focus:ring-2 focus:ring-[#B8894D]/20 transition"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#221912] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#E5D4BD] bg-[#FDFBF7] px-4 py-3 text-sm outline-none focus:border-[#B8894D] focus:ring-2 focus:ring-[#B8894D]/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#B8894D] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-[#A0743C] active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#F0E6D8] text-center text-xs">
          <p>
            <Link to="/" className="text-[#8F8173] hover:text-[#221912] transition font-medium">
              ← Return to Website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
