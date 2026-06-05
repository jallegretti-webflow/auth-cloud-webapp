import type { NextConfig } from "next";

// Match the official Webflow Cloud convention: read basePath from BASE_URL
// (which Webflow Cloud's build pipeline injects at build time from the
// dashboard's Mount Path setting). Empty locally, "/app" in production.
// NEXT_PUBLIC_BASE_PATH mirrors it into the client bundle so the auth client
// can build correct fetch URLs.
const basePath = process.env.BASE_URL || "";

const nextConfig: NextConfig = {
  ...(basePath && {
    basePath,
    assetPrefix: process.env.ASSETS_PREFIX || basePath,
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
