"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome, {session.user?.name}
        </h1>
        <p className="text-gray-600">
          You&apos;re signed in. This page is gated by Better Auth.
        </p>
        <button
          type="button"
          onClick={async () => {
            await signOut({
              fetchOptions: {
                onSuccess: () => router.push("/login"),
              },
            });
          }}
          className="inline-flex items-center justify-center rounded-md bg-webflow-blue px-4 py-2 text-sm font-medium text-white hover:bg-webflow-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-webflow-blue"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
