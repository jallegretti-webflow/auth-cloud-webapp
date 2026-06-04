import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/app",
  async redirects() {
    // With basePath: "/app" set, Next.js serves nothing at "/" — visiting it
    // would 404. This redirect sends "/" → "/app" so the app is reachable at
    // the root of the dev origin. basePath: false keeps the source/destination
    // literal (otherwise Next would prefix them with basePath).
    return [
      {
        source: "/",
        destination: "/app",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
