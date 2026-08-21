# AGENTS.md

Compact guidance for working in this repo. Every line is something an agent would likely miss without help.

## Overview

pnpm monorepo (packageManager `pnpm@11.22.0`, Node `>=24`). Two apps + one shared lib:

- `apps/backend` — Hono REST API (ESM, tsup build). CMS proxy + TMDB metadata.
- `apps/frontend` — Vite + React 19 + React Router + Ant Design 6 + Zustand.
- `packages/shared` — shared TS types (`@vodhub/shared`), bundled inline into both apps at build.

No test framework is configured. Verify with `pnpm typecheck` and `pnpm lint`.

## Commands

```bash
pnpm install              # install all workspaces
pnpm dev                  # backend (tsx watch) + frontend (vite) together
pnpm dev:backend          # backend only
pnpm dev:frontend         # frontend only
pnpm lint:fix             # auto-fix lint across all apps
pnpm format               # prettier write
pnpm typecheck            # tsc across all apps
pnpm build                # build backend (tsup) + frontend (vite)
pnpm commit               # interactive conventional commit (husky + commitlint)
```

Single package: `pnpm --filter @vodhub/backend <script>` / `pnpm --filter @vodhub/frontend <script>`.

## Backend gotchas

- **CMS proxy action is a header, not a query param.** `GET /api/vodhub/cms/proxy` requires `x-proxy-target` (CMS base URL) and `x-proxy-action` (`home` | `homeVod` | `category` | `detail` | `play` | `search`). See `apps/backend/src/modules/cms/proxy.ts`. `category`/`play`/`search` are never cached.
- **Status codes** (`constant/code.ts`): `SUCCESS_CODE = 0`, `ERROR_CODE = -1` (upstream/business failure), `SYSTEM_ERROR_CODE = -2` (exception).
- **CMS upstream success = `res.code === 1`** (check before mapping). On failure or catch, return `data: []` (lists) or `data: null` (detail); on error also set `Cache-Control: no-cache`.
- **Route handlers must never throw** — always return a structured `{ code, message, data }` (`ApiResponse<T>` from `@vodhub/shared`).
- Cache key `vod-hub:redis-cache:${path}${bodyHash}`; GET with `Cache-Control: no-cache` is not cached.
- Modules are registered explicitly in `app.tsx` (no auto-discovery). Three modules: `config`, `cms`, `tmdb`.
- CMS util handlers are named `handler` (const); TMDB handlers are inline in each module's `app.ts`.

## Frontend gotchas

- **Theme colors must use CSS variables** (`var(--color-bg-container)` etc.) — never hardcode hex/rgba.
- Components use `export default`; use `createStyles` (antd-style) for CSS-in-JS; props as `interface` destructured in params.
- `any` is allowed but a **lint warning** (repo-wide `no-explicit-any: warn`), not an error.
- API base: `BaseRequest` (`utils/request`) defaults prefix `/api/vodhub`; a custom base URL is read from `localStorage["vod_hub_api"]` (via `store2`).
- Video sources live in `useVideoSourcesStore` (Zustand + `persist`); built-in sources are defined in the frontend. No per-source backend routes.
- **TMDB/CMS view toggle** in `SiteHeader` only appears when BOTH the API is reachable AND a TMDB token is configured (`/api/vodhub/config`).
- Heavy components (e.g. `VodPalyer`) are `React.lazy` + `Suspense`.

## Conventions (enforced by lint/format)

- **Imports** (`import-x/order`): groups `builtin → external → internal (@/)`, blank line between groups, alphabetized case-insensitive. Use `import type` for types; Node builtins use `node:` prefix.
- **Prettier**: single quotes, no trailing commas, 4-space indent, `printWidth: 200`, semicolons on.
- Names: `camelCase` fns, `PascalCase` types/components, `UPPER_SNAKE_CASE` constants, `use*` hooks, `use*Store` stores.

## Git / commit

- Commit messages are **Chinese**, conventional (`type: subject`), body lists changes **per file** with `- path：description`, each line ≤ 100 chars (wrap + indent). Use `pnpm commit`.
- **Commit only staged files** — do not `git add` unstaged changes; husky `pre-commit` runs `lint-staged`, `commit-msg` runs commitlint.
- **After every code edit run `pnpm lint:fix` and `pnpm format`** before finishing.

## Environment

- `.npmrc` overrides the registry to a Chinese mirror (`registry.npmmirror.com`) — leave it.
- Prod deploy: `docker compose -f docker-compose.prod.yml up -d` (frontend :3000→80, backend :8888, redis :6379; env `REDIS_URL`, `CACHE_TTL`, `BANNED_KEYWORDS`, `TMDB_ENABLED`, `TMDB_API_TOKEN`).
- DevContainer available (`.devcontainer/`) for isolated dev.
