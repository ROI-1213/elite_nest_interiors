import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Elite Nest Interior" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome back.");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. You can sign in now.");
      setMode("signin");
    }
  }

  return (
    <SiteLayout>
      <section className="container-prose grid place-items-center py-16 md:py-24">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">
            {mode === "signin" ? "Sign in" : "Create admin account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Access the admin dashboard to manage your website content."
              : "After signup, ask the studio owner to grant your account admin access."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground/80">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground/80">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <button
              disabled={busy}
              className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "Need an account?" : "Already have one?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-medium text-accent hover:underline">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
          <p className="mt-2 text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to website</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
