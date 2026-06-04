import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDbAsync } from "../db/getDb";
import * as schema from "../db/schema";

export const createAuth = async () => {
  const db = await getDbAsync();

  const { env } = await getCloudflareContext({ async: true });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseUrl: env.BETTER_AUTH_URL,
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:8787",
      env?.BETTER_AUTH_URL ?? "",
    ],
  });
};
