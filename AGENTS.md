# AGENTS.md

## Cursor Cloud specific instructions

`onedev` is a single **SvelteKit 2 + Svelte 5** web app (Vite 7, Tailwind 4 + DaisyUI) that ships a large suite of **100% client-side** developer tools. There is no backend, database, cache, queue, `.env`, or external API — running the dev server is all that is needed to test any tool end to end.

Package manager is **pnpm** (`engine-strict=true`). Commands (see `package.json` scripts):

- Run (dev): `pnpm dev` — Vite dev server on http://localhost:5173. This is the only service.
- Build: `pnpm build` — builds via `@sveltejs/adapter-cloudflare` into `.svelte-kit/cloudflare`.
- Preview prod build: `pnpm preview` — runs `wrangler dev` on port 4173 (only needed to validate the Cloudflare edge build, not for feature work).
- Type check: `pnpm check` (svelte-check).
- Lint: `pnpm lint` (`prettier --check .` then `eslint .`).

Non-obvious caveats:

- `pnpm lint`, `pnpm check`, and `pnpm exec eslint .` currently report **many pre-existing failures** (Prettier formatting on ~259 files, plus ESLint/svelte-check errors) on a clean checkout. These are baked into the repo — they are NOT caused by environment setup. Don't attempt a repo-wide reformat; only worry about lint/type errors in files you actually touch.
- `pnpm install` runs a `prepare` step that executes `wrangler types` + `svelte-kit sync` (generates `worker-configuration.d.ts` and `.svelte-kit/`). This is offline/local and needs no Cloudflare credentials.
- Deployment target is Cloudflare Workers (`wrangler.jsonc`), but deploying is never required for local development or testing.
