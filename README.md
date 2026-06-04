# Better Auth + Webflow Cloud (Next.js)

A minimal [Webflow Cloud](https://webflow.com/cloud) example showing email/password authentication with [Better Auth](https://better-auth.com/), backed by Cloudflare D1 via Drizzle ORM. Sign up, log in, log out — server-validated httpOnly sessions, no third-party identity provider.

## Stack

- **Next.js** — App Router, deployed on Cloudflare via [OpenNext](https://opennext.js.org/cloudflare)
- **Better Auth** — session management, email/password sign-in
- **Drizzle ORM** + **Cloudflare D1** — user / session / account tables

## Prerequisites

- Node.js 18+, npm, Git

That's it. You do **not** need the Webflow CLI to run or deploy this template — deploys happen via the Webflow Cloud GitHub integration.

## Quick start

```bash
# 1. Fork + clone this repo
git clone https://github.com/<you>/auth-cloud-webapp.git
cd auth-cloud-webapp

# 2. Set up local env vars
cp .dev.vars.template .dev.vars
# In .dev.vars, replace BETTER_AUTH_SECRET with the output of:
#   openssl rand -base64 32
# (BETTER_AUTH_URL defaults to http://localhost:3000 — the `next dev` port.
#  If you use `npm run preview` instead, change it to http://localhost:8787.)

# 3. Install dependencies
npm install

# 4. Apply the existing D1 migration locally
npm run db:apply:local

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000/app](http://localhost:3000/app):

- `/app/signup` — create an account
- `/app/login` — sign in
- `/app` — protected home (redirects to `/app/login` when signed out)

The mount path is `/app` by default (configured in `next.config.ts`'s `basePath` and matched by the Webflow Cloud project settings below).

## Deploy to Webflow Cloud

Deploys are wired up through GitHub — push to `main` and Webflow Cloud builds and ships automatically. The first time you set up the project:

1. **Push your fork to GitHub.**
2. In your Webflow site settings, open the **Webflow Cloud** tab and click **Install GitHub App**. Authorize access to your fork.
3. Click **Create New Project**, select the fork, and create an environment:
   - **Branch:** `main`
   - **Mount Path:** `/app`
4. **Add environment variables** on the Deployments page → Environment Variables tab:
   - `BETTER_AUTH_URL` — your Webflow site domain, e.g. `https://your-site.webflow.io`
   - `BETTER_AUTH_SECRET` — **generate a new secret for production.** Don't reuse your local secret. Run `openssl rand -base64 32` again and mark the value as a secret in the dashboard.
5. Click **Deploy latest commit** and then **Publish** the Webflow site.

The D1 migrations in `drizzle/` are applied automatically by the Webflow Cloud build pipeline — there's no separate migration step for production.

After the first deploy, future updates are just `git push` to `main`.

> **Why a separate `BETTER_AUTH_SECRET` for prod?** The secret signs session tokens. Reusing your local dev secret in prod means anyone who saw it during development could mint valid prod sessions. Always generate a fresh value for production and treat it like a database password.

## Project structure

```text
.
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/route.ts   # Better Auth catch-all handler
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── page.tsx                     # protected home
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── auth.ts                      # Better Auth server config (Drizzle + D1)
│   │   └── auth-client.ts               # Better Auth React client
│   └── db/
│       ├── getDb.ts                     # Drizzle D1 client
│       └── schema/                      # user / session / account / verification
├── drizzle/                             # generated migrations (committed)
├── drizzle.config.ts
├── wrangler.json                        # D1 binding + nodejs_compat
├── next.config.ts                       # basePath: "/app"
├── open-next.config.ts
└── webflow.json
```

## Scripts

| Command | What it does |
| :-- | :-- |
| `npm run dev` | Next.js dev server at [http://localhost:3000](http://localhost:3000). |
| `npm run build` | Production Next.js build. |
| `npm run preview` | OpenNext build + local Cloudflare Worker preview. |
| `npm run deploy` | OpenNext build + deploy via `opennextjs-cloudflare` (rarely needed — Webflow Cloud handles deploys via GitHub). |
| `npm run db:apply:local` | Apply migrations to the local D1 database. |
| `npm run db:generate` | Generate a new migration after schema changes (see below). |
| `npm run cf-typegen` | Regenerate Cloudflare types into `cloudflare-env.d.ts`. |

## Schema changes

If you edit `src/db/schema/*`, generate a new migration:

```bash
npm run db:generate    # writes a new SQL file into drizzle/
npm run db:apply:local # applies it to your local D1
```

Commit and push — Webflow Cloud applies the new migration to the hosted D1 instance on the next deploy.

## License

MIT.
