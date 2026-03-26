# AGENTS.md

## Project Overview

VodHub is a **pnpm monorepo** with two apps:
- **`apps/backend`** (`@vodhub/backend`): Hono-based video aggregation API. Normalizes multiple video source providers into a unified REST API (categories, search, details, playback). Node >= 24, ESM.
- **`apps/frontend`** (`@vodhub/frontend`): Next.js 16 + React 19 video player app. Ant Design 6, Zustand, SCSS Modules with multi-theme support.

## Build / Dev Commands

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start both backend + frontend dev servers
pnpm dev:backend          # Backend only (tsx watch)
pnpm dev:frontend         # Frontend only (next dev)

# Linting
pnpm lint                 # Lint all apps (pnpm -r lint)
pnpm --filter @vodhub/backend lint        # Backend only
pnpm --filter @vodhub/backend lint:fix    # Backend auto-fix

# Type checking
pnpm typecheck            # Typecheck all apps (pnpm -r typecheck)

# Formatting
pnpm format               # Prettier write on apps/*/src/**/*.{ts,tsx}
pnpm format:check         # Prettier check

# Backend start (no watch)
pnpm --filter @vodhub/backend start

# Frontend build
pnpm --filter @vodhub/frontend build

# Commits (interactive, conventional)
pnpm commit
```

There is **no test framework** configured. Do not assume one exists.

Lint-staged runs automatically on commit via Husky. Commit messages are validated by commitlint (conventional commits).

## Monorepo Structure

```
apps/
  backend/
    src/
      index.ts          # Server entry: boots @hono/node-server
      app.tsx            # Hono app: middleware + route mounting
      api/               # OpenAPI metadata routes
      config/            # App config (port, cache TTL, banned keywords)
      constant/          # Status codes, messages, user-agents, word lists
      middleware/         # Cache middleware, JSON response middleware
      routes/            # Provider route directories (auto-discovered)
        registry.ts      # Dynamic route loader using directory-import
      types/             # Core types (Namespace, Route, HomeData, etc.)
      utils/             # Shared CMS handlers, cache, logger, filters
  frontend/
    app/                 # Next.js App Router pages
    components/          # Providers, video, icons, UI components
    lib/                 # Constants, hooks, stores, themes, types, utils
    services/            # API service layer
```

Route URL pattern: `GET/POST /api/vodhub/<provider>/<action>`
Actions per provider: `home`, `homeVod`, `category`, `detail`, `play`, `search`

## Adding a Backend Provider Route

### CMS-Based Provider (Recommended)

Only `namespace.ts` and `index.ts` are needed in `apps/backend/src/routes/<provider-name>/`:

```typescript
// namespace.ts
import type { Namespace } from '@/types';
export const namespace: Namespace = {
    name: 'Provider Name',
    url: 'https://example.com',
    description: 'Provider description'
};

// index.ts
import { namespace } from './namespace';
import { createCMSRoutes } from '@/utils/cms/factory';
export const routes = createCMSRoutes(namespace);
```

Routes auto-register via `directory-import` in `registry.ts`.

### Custom Provider

For non-CMS sources, create individual route files:
`namespace.ts`, `home.ts`, `homeVod.ts`, `category.ts`, `detail.ts`, `play.ts`, `search.ts`. Each exports a `route` object conforming to the typed `Route` interface.

## Code Style

### Formatting (Prettier)
- Single quotes, no trailing commas
- 4-space indentation (`tabWidth: 4`)
- 200 char print width, LF line endings, semicolons always

### Imports (both apps)
- Use `@/` path alias: backend maps to `src/`, frontend maps to app root
- Relative imports within the same provider directory (e.g., `./namespace`)
- Use `node:` prefix for Node built-ins (e.g., `import { join } from 'node:path'`)
- Import order (enforced by ESLint): **builtins → externals → internals**, blank line between groups, alphabetized within groups
- Use `import type` for type-only imports

### Naming Conventions
| Item | Convention | Example |
|---|---|---|
| Variables, functions, params | `camelCase` | `getLocalhostAddress`, `cacheKey` |
| Types, interfaces, classes | `PascalCase` | `HomeData`, `RouteItem` |
| Constants | `UPPER_SNAKE_CASE` | `SUCCESS_CODE`, `BANNED_KEYWORDS` |
| Handler functions | Always `handler` | `const handler = async (ctx) => { ... }` |
| Frontend components | PascalCase | `VodList`, `InitProvider` |
| Frontend hooks | `use` prefix | `useIsMobile`, `useThemeStore` |
| Frontend stores | `use` + `Store` suffix | `useSettingStore`, `useThemeStore` |

### Types (Backend)
- Shared types in `apps/backend/src/types/`
- Use `RouteItem<T>` generic: `type HomeRoute = RouteItem<{ code: number; data: HomeData[] }>`
- `noImplicitAny` is `false`, but ESLint enforces `no-explicit-any: "error"`

### Types (Frontend)
- Shared types in `apps/frontend/lib/types/`
- `any` is allowed (`no-explicit-any: off`)
- Prefer `interface` for object types; API responses use generics

### Exports
- **Backend**: Named exports only (except `RequestInProgressError`)
- **Frontend**: Components use `export default`; utilities/stores use named exports

## Error Handling (Backend)

Three status codes: `SUCCESS_CODE=0`, `ERROR_CODE=-1`, `SYSTEM_ERROR_CODE=-2`

Every handler must follow this pattern:
```typescript
const handler = async (ctx: Context) => {
    try {
        logger.info(`${ACTION_MESSAGE.INFO} - ${namespace.name}`);
        const res = await someRequest();
        if (res.code === 1) {
            return { code: SUCCESS_CODE, message: ACTION_MESSAGE.SUCCESS, data: [...] };
        }
        logger.error(`${ACTION_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return { code: ERROR_CODE, message: ACTION_MESSAGE.ERROR, data: [] };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${ACTION_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return { code: SYSTEM_ERROR_CODE, message: ACTION_MESSAGE.ERROR, data: [] };
    }
};
```

- Never throw — always return `{ code, message, data }`
- Set `Cache-Control: no-cache` in catch blocks
- Always return `data: []` on failure
- Use message constants from `@/constant/message`
- CMS handlers check `res.code === 1` for upstream success

## Frontend Style Rules
- Client components require `'use client'` directive
- Use SCSS Modules (`index.module.scss`) with `vod-next-` class prefix
- All colors must use CSS variables (e.g., `var(--color-bg-container)`) — never hardcode hex/rgba
- State management: Zustand with `persist` middleware, stores in `lib/store/`
- API calls: wrap in try/catch, use `request.get<T>` / `request.post<T>`

## General Rules
- No comments unless explicitly requested
- Use `const` over `let`; avoid `var`
- Prefer `async/await` over `.then()` chains
- The project uses ESM (`"type": "module"` in package.json)
