import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? `${window.location.origin}/app/api/auth`
      : "http://localhost:8787/app/api/auth",
});
