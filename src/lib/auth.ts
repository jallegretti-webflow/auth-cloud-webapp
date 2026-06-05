import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDbAsync } from "../db/getDb";
import * as schema from "../db/schema";

export const createAuth = async () => {
  const db = await getDbAsync();

  const { env } = await getCloudflareContext({ async: true });

  // NEXT_PUBLIC_BASE_PATH is inlined at build time from next.config.ts.
  // In production on Webflow Cloud it's "/app" (or whatever Mount Path is
  // set to); locally it's "". Better Auth needs the full mounted prefix
  // (Next.js basePath + "/api/auth") otherwise its internal router will
  // 404 incoming requests whose URLs include the Next basePath.
  const nextBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: `${nextBasePath}/api/auth`,
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:8787",
      env?.BETTER_AUTH_URL ?? "",
    ],
  });
};
