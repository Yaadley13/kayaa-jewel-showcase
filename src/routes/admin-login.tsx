import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Jewels by Kayaa" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, go straight to admin
  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/admin" });
    }
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (authError) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Session is now saved in localStorage by Supabase JS automatically.
    // Navigate to admin panel.
    navigate({ to: "/admin" });
  };

  // While checking stored session, show nothing (avoids flash)
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <section className="flex min-h-[calc(100dvh-theme(spacing.32))] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Lock icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="grid h-14 w-14 place-items-center rounded-full"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            <Lock size={22} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">
            Studio Access
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[#2b2421]">Admin Login</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to manage your jewellery studio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1.5 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="login-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-gradient btn-gradient-hover w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <style>{`
        .login-input {
          width: 100%;
          border: 1px solid var(--border);
          background: var(--color-cream);
          padding: 0.7rem 0.9rem;
          border-radius: 0.6rem;
          font-size: 0.9rem;
          outline: none;
        }
        .login-input:focus {
          border-color: var(--color-pink);
        }
      `}</style>
    </section>
  );
}
