import { createAuthClient } from "better-auth/react";

// NEXT_PUBLIC_BASE_PATH is set in next.config.ts from the BASE_URL env var
// (which Webflow Cloud's build pipeline populates from the dashboard's Mount
// Path). Empty locally, "/app" in production. The auth client needs this so
// it posts to the right URL — Better Auth's catch-all route lives under the
// same basePath as the rest of the app.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? `${window.location.origin}${basePath}/api/auth`
      : `http://localhost:3000${basePath}/api/auth`,
});
