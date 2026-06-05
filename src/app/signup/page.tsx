"use client";

import { signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { WebflowLogo } from "@/components/WebflowLogo";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) router.push("/");
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/app",
      });
      if (error) setError(error.message || "Signup failed");
      else if (data) router.push("/");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="wf-page flex items-center justify-center">
        <div className="text-wf-fg-dim">Loading…</div>
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="wf-page">
      <div className="wf-glow" aria-hidden="true" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <WebflowLogo size={32} />
          <span className="text-sm font-semibold tracking-tight text-wf-fg">
            Webflow Cloud
          </span>
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-wf-border bg-wf-surface p-8 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <p className="mb-3 inline-block rounded-full border border-wf-border bg-wf-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-wf-fg-dim">
              Create account
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-wf-fg">
              Get started
            </h1>
            <p className="mt-2 text-sm text-wf-fg-dim">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-wf-blue transition hover:text-wf-blue-2"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-wf-border bg-wf-bg/40 px-4 py-2.5 text-sm text-wf-fg placeholder:text-wf-fg-mute focus:border-wf-blue focus:outline-none focus:ring-2 focus:ring-wf-blue/30"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-wf-border bg-wf-bg/40 px-4 py-2.5 text-sm text-wf-fg placeholder:text-wf-fg-mute focus:border-wf-blue focus:outline-none focus:ring-2 focus:ring-wf-blue/30"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-wf-border bg-wf-bg/40 px-4 py-2.5 text-sm text-wf-fg placeholder:text-wf-fg-mute focus:border-wf-blue focus:outline-none focus:ring-2 focus:ring-wf-blue/30"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="wf-btn-glow w-full rounded-lg bg-wf-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2a7ef8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-xs text-wf-fg-mute">
          Built with Better Auth · Deployed on{" "}
          <a
            href="https://webflow.com/cloud"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-wf-blue"
          >
            Webflow Cloud
          </a>
        </p>
      </main>
    </div>
  );
}
