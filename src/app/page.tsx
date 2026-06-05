"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WebflowLogo } from "@/components/WebflowLogo";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="wf-page flex items-center justify-center">
        <div className="text-wf-fg-dim">Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="wf-page">
      <div className="wf-glow" aria-hidden="true" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-8 py-7">
        <div className="flex items-center gap-3">
          <WebflowLogo size={28} />
          <span className="text-sm font-semibold tracking-tight text-wf-fg">
            Webflow Cloud
          </span>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut({
              fetchOptions: {
                onSuccess: () => router.push("/login"),
              },
            });
          }}
          className="rounded-full border border-wf-border-strong bg-wf-surface px-4 py-1.5 text-sm text-wf-fg-dim transition hover:bg-wf-surface-hover hover:text-wf-fg"
        >
          Log out
        </button>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-8 py-20 text-center">
        <p className="mb-7 inline-block rounded-full border border-wf-border bg-wf-surface px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-wf-fg-dim">
          Authenticated
        </p>
        <h1 className="text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
          Welcome,{" "}
          <span className="wf-gradient">{session.user?.name}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-wf-fg-dim">
          You&apos;re signed in. This page is gated by Better Auth — httpOnly
          cookie sessions backed by Cloudflare D1.
        </p>
      </main>
    </div>
  );
}
