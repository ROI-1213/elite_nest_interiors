import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { signInServerFn } from "@/lib/server-functions";
import { getStoredAuth } from "./_authenticated/route";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Portal Sign In — Elite Nest Interiors" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If already logged in, redirect straight to /admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = getStoredAuth();
      if (auth && auth.isAdmin) {
        window.location.replace("/admin");
        return;
      }
    }
    setCheckingSession(false);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setBusy(true);

    try {
      // Authenticate directly against PostgreSQL database using JWT
      const res = await signInServerFn({
        data: {
          email: email.trim().toLowerCase(),
          password,
        },
      });

      if (res?.success && res?.token && res?.isAdmin) {
        if (typeof window !== "undefined") {
          localStorage.setItem("elite_admin_token", res.token);
          // Set cookie for 7 days matching JWT expiration to ensure cross-request persistence
          document.cookie = `elite_admin_token=${encodeURIComponent(res.token)}; path=/; max-age=604800; SameSite=Lax;`;
        }
        toast.success("Welcome back, Administrator!");
        window.location.replace("/admin");
        return;
      }

      if (res && !res.success) {
        toast.error(res.error || "Invalid email or password. Please try again.");
        setBusy(false);
        return;
      }

      toast.error("Invalid email or password. Please try again.");
      setBusy(false);
    } catch (err: any) {
      console.error("[signIn error]:", err);
      const msg = err?.message || "Connection error. Please try again.";
      toast.error(msg);
      setBusy(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B8894D]" />
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#8F8173]">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative luxury gradient background glows */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#B8894D]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#B8894D]/15 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-3xl border border-[#E5D4BD] bg-white p-8 md:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          {/* Logo in Dark Luxury Pill */}
          <Link to="/" className="inline-block mb-4 overflow-visible group">
            <div className="mx-auto flex h-20 w-full max-w-[280px] items-center justify-center rounded-2xl bg-[#1A1410] px-6 py-3 border border-[#C49A5A]/50 shadow-md transition-transform group-hover:scale-105">
              <img
                src={logo}
                alt="Elite Nest Interiors"
                className="h-14 w-auto object-contain filter drop-shadow-md"
              />
            </div>
          </Link>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8894D]/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9E6E34]">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Control Panel
            </span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-medium text-[#221912]">
            Admin Sign In
          </h1>
          <p className="mt-2 text-xs text-[#6F6257] leading-relaxed">
            Enter your administrator credentials to manage projects, services, enquiries & content.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#221912] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E6E34]/70">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-[#E5D4BD] bg-[#FDFBF7] pl-10 pr-4 py-3 text-sm text-[#221912] outline-none focus:border-[#B8894D] focus:ring-2 focus:ring-[#B8894D]/25 transition placeholder:text-[#A89C91]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#221912] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E6E34]/70">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5D4BD] bg-[#FDFBF7] pl-10 pr-11 py-3 text-sm text-[#221912] outline-none focus:border-[#B8894D] focus:ring-2 focus:ring-[#B8894D]/25 transition placeholder:text-[#A89C91]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8F8173] hover:text-[#221912] transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#B8894D] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-[#A0743C] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In to Admin Portal"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#F0E6D8] text-center text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[#8F8173] hover:text-[#221912] transition font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
