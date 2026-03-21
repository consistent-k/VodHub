# AGENTS.md

## Project Overview

VodHub is a video aggregation API service built with **Hono** (web framework) on Node.js. It normalizes multiple video source providers into a unified REST API supporting categories, search, details, and playback. TypeScript throughout. pnpm as package manager.

## Build / Dev Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server with hot reload (tsx watch)
pnpm start            # Start server without watch
```

There is **no test framework** configured in this project. Do not assume one exists.

### Linting & Formatting

No npm scripts for lint/format. Run directly:

```bash
npx eslint src/ --ext .ts,.tsx        # Lint
npx eslint src/ --ext .ts,.tsx --fix  # Lint with auto-fix
npx prettier --cache --write "src/**/*.{ts,tsx}"  # Format
```

Lint-staged runs automatically on commit via Husky for `.ts`, `.tsx`, `.js`, `.md`, `.json` files.

### Type Checking

No `tsc` script in package.json. Run manually:

```bash
npx tsc --noEmit
```

### Commits

Uses **commitizen** with conventional commits (`@commitlint/config-conventional`). Run `pnpm commit` to use the interactive prompt.

## Architecture

```
src/
  index.ts          # Server entry: boots @hono/node-server
  app.tsx           # Hono app: global middleware + route mounting
  api/              # OpenAPI metadata routes
  config/           # App config (port, cache TTL, banned keywords)
  constant/         # Status codes, messages, user-agents, word lists
  middleware/        # Cache middleware, JSON response middleware
  routes/           # Provider route directories (auto-discovered)
    registry.ts     # Dynamic route loader using directory-import
  types/            # Core types (Namespace, Route, HomeData, etc.)
  utils/            # Shared CMS handlers, cache, logger, filters
```

Route URL pattern: `GET/POST /api/vodhub/<provider>/<action>`
Actions per provider: `home`, `homeVod`, `category`, `detail`, `play`, `search`

## Adding a New Provider Route

### CMS-Based Provider (Recommended)

For standard CMS sources, only `namespace.ts` and `index.ts` are needed:

1. Create `src/routes/<provider-name>/` directory
2. Add `namespace.ts` with provider metadata
3. Add `index.ts` that uses the factory:
   ```typescript
   import { namespace } from './namespace';
   import { createCMSRoutes } from '@/utils/cms/factory';
   export const routes = createCMSRoutes(namespace);
   ```
4. Routes auto-register via `directory-import` in `registry.ts`

### Custom Provider

For non-CMS sources (e.g., 360kan), create individual route files:
`namespace.ts`, `home.ts`, `homeVod.ts`, `category.ts`, `detail.ts`, `play.ts`, `search.ts`

## Code Style

### Formatting (Prettier)
- Single quotes
- No trailing commas
- 4-space indentation (`tabWidth: 4`)
- 200 char print width
- LF line endings

### Imports
- Use `@/` path alias for `src/` (e.g., `import { namespace } from '@/types'`)
- Relative imports within the same provider directory (e.g., `./namespace`)
- Use `node:` prefix for Node built-ins (e.g., `import { join } from 'node:path'`)
- Import order (enforced by ESLint): builtins → externals → internals, blank line between groups, alphabetized within groups

### Naming
- `camelCase` for variables, functions, parameters
- `PascalCase` for types, interfaces, classes
- `UPPER_SNAKE_CASE` for constants (e.g., `SUCCESS_CODE`, `BANNED_KEYWORDS`)
- Handler functions always named `handler`
- Route files use standard names: `namespace.ts`, `home.ts`, `category.ts`, `detail.ts`, `play.ts`, `search.ts`

### Types
- Define shared types in `src/types/`
- Use `RouteItem<T>` generic for typed route definitions (e.g., `type HomeRoute = RouteItem<{ code: number; data: HomeData[] }>`)
- Use `Namespace` type for provider metadata
- `noImplicitAny` is `false` — explicit type annotations are not enforced on all parameters, but prefer them for public APIs

### Exports
- **Named exports only** (no default exports, except custom error classes)
- Each route file exports a `route` object conforming to the `Route` type
- Each namespace file exports a `namespace` object conforming to `Namespace`

### Error Handling
- Three status codes: `SUCCESS_CODE=0`, `ERROR_CODE=-1`, `SYSTEM_ERROR_CODE=-2`
- Never throw errors to the framework — always return structured `{ code, message, data }` objects
- On error, set `Cache-Control: no-cache` header to prevent caching failed responses
- Log every error with `logger.error()` including namespace name
- Use try/catch in every handler; return `data: []` on failure

### General Rules
- No comments unless explicitly requested
- Use `const` over `let`; avoid `var`
- Prefer `async/await` over `.then()` chains
- The project uses ESM (`"type": "module"` in package.json)
