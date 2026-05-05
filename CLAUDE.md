# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VodHub is a pnpm monorepo with two applications:
- **Backend** (`apps/backend`): Hono‑based video aggregation API with a single built‑in provider (`360kan`) and support for custom CMS addresses via a proxy system, providing a unified REST API (categories, search, details, playback). Node.js ≥ 24, ESM.
- **Frontend** (`apps/frontend`): Vite + React 19 + React Router video player application with Ant Design 6, Zustand state management, multi‑theme support, integrated CMS management, and TMDB metadata integration.

A shared package (`packages/shared`) provides core TypeScript types used by both apps, including video source definitions.

## Common Development Commands

### Monorepo Commands (from root)
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start both backend and frontend dev servers
pnpm dev:backend          # Backend only (tsx watch)
pnpm dev:frontend         # Frontend only (vite dev)
pnpm lint                 # Lint all apps
pnpm lint:fix            # Lint with auto‑fix
pnpm typecheck           # Type check all apps
pnpm format              # Prettier write
pnpm format:check        # Prettier check
pnpm commit              # Interactive conventional commit
pnpm build               # Build all apps (backend + frontend)
```

### Backend‑Specific Commands
```bash
pnpm --filter @vodhub/backend start     # Start backend without watch
pnpm --filter @vodhub/backend build     # Build backend (generates routes first)
pnpm --filter @vodhub/backend gen:routes # Generate route registry
pnpm --filter @vodhub/backend lint      # Lint backend only
pnpm --filter @vodhub/backend lint:fix  # Lint backend with auto‑fix
pnpm --filter @vodhub/backend typecheck # Type check backend only
```

### Frontend‑Specific Commands
```bash
pnpm --filter @vodhub/frontend build    # Production build
pnpm --filter @vodhub/frontend preview  # Preview production build
pnpm --filter @vodhub/frontend lint     # Lint frontend only
pnpm --filter @vodhub/frontend lint:fix # Lint frontend with auto‑fix
pnpm --filter @vodhub/frontend typecheck # Type check frontend only
```

## Backend Architecture

### Route System
- **URL Pattern**: `GET/POST /api/vodhub/<provider>/<action>`
- **Actions**: `home`, `homeVod`, `category`, `detail`, `play`, `search`
- **Auto‑discovery**: Routes are automatically registered via `directory‑import` in `apps/backend/src/routes/registry.ts`
- **Production optimization**: Routes are pre‑generated to `registry.gen.ts` for faster startup
- **Current Built‑in Provider**: Only `360kan` remains as the single built‑in video source provider; all other hard‑coded providers have been removed

### Provider Types
1. **Built‑in Provider**: `360kan` – the only remaining hard‑coded video source provider
2. **Custom CMS Providers**: User‑defined CMS sources managed via the frontend CMS management interface, dynamically proxied through the `/api/vodhub/proxy` endpoint
3. **CMS Factory Pattern**: The `createCMSRoutes()` factory in `apps/backend/src/utils/cms/factory.ts` dynamically creates route handlers for custom CMS addresses

### CMS Management & Proxy
- **Proxy API**: `ALL /api/vodhub/proxy` – forwards requests to user‑defined CMS URLs using `x-proxy-target` and `x-proxy-action` headers to translate actions to the target CMS's API format
- **Video Source Store**: CMS and video source configurations are managed locally via `useVideoSourcesStore` (Zustand + localStorage), which replaces the old `useCmsStore`
- **Video Source Types**: Two categories:
  1. **Built-in Sources**: Pre-configured video sources defined in `apps/frontend/src/data/builtin-cms.json`
  2. **Custom Sources**: User-defined CMS addresses with full CRUD support
- **CMS Factory**: The `createCMSRoutes()` factory dynamically generates route handlers for custom CMS addresses, enabling flexible video source management without hard‑coded backend routes

### TMDB Integration
- **Config API**: `GET /api/config` – returns TMDB enabled status and API token to the frontend
- **Config Store**: `useAppConfigStore` fetches config from backend and initializes TMDB client
- **Environment Variables**: `TMDB_ENABLED` (boolean string), `TMDB_API_TOKEN` (TMDB API read access token)
- **TMDB Stores**:
  - `useTmdbStore` – homepage data (trending/popular/now playing etc.)
  - `useTmdbDetailStore` – current TMDB item detail and CMS match results
  - `useTmdbMatchStore` – TMDB-to-CMS match cache with 24h TTL, persisted to localStorage
- **TMDB Hooks** (`hooks/useTmdb.ts`):
  - `useTmdbHome` – batch fetch homepage categories (trending/popular/now playing)
  - `useTmdbSearch` – multi-type search with debounce and request cancellation
  - `useTmdbDetail` – movie/TV detail fetch
- **TMDB Utils**:
  - `utils/tmdb.ts` – client management, image URL construction, Movie/TV data normalization
  - `utils/tmdb-match.ts` – parallel search across enabled CMS sources, cache results to matchStore
- **TMDB Components**:
  - `FeaturedCarousel` – hero carousel with background image, title, rating, overview
  - `SearchTmdb` – TMDB search with Cmd/Ctrl+K shortcut, auto-match CMS sources on click
  - `MediaList` – universal media list replacing `VodList`, supports custom columns, badges, hover overlay
- **View Mode**: Site header has TMDB/CMS toggle button (shown when both API and TMDB token are configured)

### Middleware Order
1. `cors()` – CORS handling
2. `trimTrailingSlash()` – trailing slash normalization  
3. `compress()` – response compression
4. `jsonReturn` – JSON response serialization
5. `cache` – Redis/memory caching with deduplication

### Caching System
- Two‑level cache: memory LRU + optional Redis via Keyv
- Deduplication: prevents concurrent identical requests
- Cache key format: `vod‑hub:redis‑cache:${path}${bodyHash}`
- Error responses: set `Cache‑Control: 'no‑cache'` to prevent caching failures

### Error Handling Pattern
All handlers must follow this structure:
```typescript
try {
    logger.info(`${ACTION_MESSAGE.INFO} ‑ ${namespace.name}`);
    const res = await someRequest();
    if (res.code === 1) {  // CMS convention
        return { code: SUCCESS_CODE, message: ACTION_MESSAGE.SUCCESS, data: […] };
    }
    logger.error(`${ACTION_MESSAGE.ERROR} ‑ ${namespace.name} ‑ ${JSON.stringify(res)}`);
    return { code: ERROR_CODE, message: ACTION_MESSAGE.ERROR, data: [] };
} catch (error) {
    ctx.res.headers.set('Cache‑Control', 'no‑cache');
    logger.error(`${ACTION_MESSAGE.ERROR} ‑ ${namespace.name} ‑ ${error}`);
    return { code: SYSTEM_ERROR_CODE, message: ACTION_MESSAGE.ERROR, data: [] };
}
```

**Status Codes**:
- `SUCCESS_CODE = 0` – successful response
- `ERROR_CODE = -1` – business logic error (upstream failure)
- `SYSTEM_ERROR_CODE = -2` – exception/catch error

### Import Conventions
- **Groups**: Built‑ins → external packages → internal modules (`@/`), separated by blank lines
- **Alphabetization**: Imports within each group should be alphabetized (case‑insensitive)
- **Type imports**: Use `import type` for type‑only imports
- **Node built‑ins**: Use the `node:` prefix (e.g., `import { join } from 'node:path'`)

### Route Object Shape
Each custom route file exports a `route` object with the following properties:
- `path`: string or string[] – URL path segment(s)
- `name`: string – route identifier (matches filename)
- `example`: string – example URL path
- `description`: string – what the route does
- `handler`: (ctx: Context) => Promise<T> | T
- `method?`: 'GET' | 'POST' – defaults to GET

### Handler Naming
- The handler function must be named `handler` (constant) in each route file
- Use typed `RouteItem<T>` generic for route definitions

## Frontend Architecture

### Tech Stack
- **Framework**: Vite + React 19 + React Router + TypeScript
- **UI**: Ant Design 6 with SCSS Modules
- **State Management**: Zustand stores with `persist` middleware
- **Video Player**: xgplayer + HLS.js
- **Styling**: CSS variables for multi‑theme support
- **TMDB**: `tmdb-ts` library for TMDB API integration

### Theme System
Three built‑in themes defined in `themes/index.ts`:
- **midnight**: dark with red accent
- **aurora**: light with cyan accent  
- **cyber**: dark with purple accent

**Key Rule**: All colors must use CSS variables (`var(--color‑bg‑container)`) – never hardcode hex/rgba values.

### CSS Variables Reference
| Category | Variable | Description |
|---|---|---|
| Brand | `--color-primary` | Primary color |
| Brand | `--color-primary-light` | Light primary |
| Background | `--color-bg` | Page background |
| Background | `--color-bg-container` | Container background |
| Background | `--color-bg-elevated` | Elevated background |
| Background | `--color-bg-container-alpha` | Semi‑transparent container |
| Background | `--color-bg-elevated-alpha` | Semi‑transparent elevated |
| Background | `--color-bg-elevated-hover` | Hover state background |
| Text | `--color-text` | Primary text |
| Text | `--color-text-secondary` | Secondary text |
| Text | `--color-text-tertiary` | Tertiary text |
| Border | `--color-border` | Border |
| Border | `--color-border-secondary` | Secondary border |
| State | `--color-primary-alpha-low` | Selected state |
| State | `--color-primary-alpha-medium` | Border accent |
| State | `--color-primary-alpha-hover` | Hover state |
| State | `--color-primary-shadow` | Shadow |
| Overlay | `--color-overlay` | Overlay background |
| Overlay | `--color-overlay-border` | Overlay border |

### State Management
- Stores in `store/` with naming `use{Name}Store.ts`
- Zustand `persist` middleware for localStorage persistence
- Theme state updates both CSS variables and Ant Design theme config

### Component Structure
- Components are client‑side by default (no `'use client'` directive needed)
- SCSS Modules with `vod‑next‑` class prefix (historical naming convention)
- Props defined with `interface` and destructured in params
- Components use `export default`

### Error Handling
- **HTTP errors**: Rejected via fetch/HTTP client
- **API calls**: Wrap in try/catch, re‑throw as `Promise.reject`
- **UI errors**: Display with Ant Design `message` component

### Performance Guidelines
- Use `React.memo` to avoid unnecessary re‑renders
- Use `useMemo` and `useCallback` for expensive computations
- Use `React.lazy()` with `Suspense` for heavy components (e.g., video player)
- Use `Suspense` for async loading

### Design System
- Vercel‑inspired visual guidelines (colors, typography, shadows, component styling).

### CMS Management UI
- Component: `components/CmsManagement/index.tsx`
- Store: `store/useVideoSourcesStore.ts` (Zustand + localStorage) – replaces the old `useCmsStore`
- Data Source: Built-in video sources defined in `apps/frontend/src/data/builtin-cms.json`
- Features:
  - Table display of all video sources (built‑in + custom)
  - Enable/disable built‑in video sources
  - Full CRUD operations for custom video sources
  - Integration with site selector components
- Changes are persisted locally in localStorage; backend API synchronization may be added in the future

## Shared Types

Core types defined in `packages/shared/src/types/index.ts`:
- `Namespace` – provider metadata
- `HomeData`, `HomeVodData`, `CategoryVodData` – data structures
- `DetailData`, `PlayData`, `SearchData` – response types
- `ApiResponse<T>` – standard API response wrapper

Video source types defined in `packages/shared/src/types/video-source.ts` (formerly `custom-cms.ts`):
- `VideoSource` – unified type for both built-in and custom video sources
- `VideoSourceType` – type alias: `'builtin' | 'custom'`
- `BuiltinVideoSource` – pre-configured video source definition
- `CustomVideoSource` – user-defined CMS address configuration

## Deployment

### Docker Compose
- **Development**: `docker‑compose up ‑d` (uses `docker‑compose.yml`)
- **Production**: `docker‑compose ‑f docker‑compose.prod.yml up ‑d` (includes Redis, log persistence)

### Production Environment
- **Services**: frontend, backend, redis
- **Ports**: 3000→80 (frontend), 8888→8888 (backend), 6379→6379 (redis)
- **Environment Variables**: `REDIS_URL`, `CACHE_TTL`, `BANNED_KEYWORDS`, `TMDB_ENABLED`, `TMDB_API_TOKEN`
- **Log Persistence**: `./logs` mapped to `/app/apps/backend/logs`

## Development Standards

### Code Style
- **Backend**: Named exports only, `any` disallowed (`no‑explicit‑any: error`)
- **Frontend**: `any` allowed, `export default` for components, named exports for utilities
- **Imports**: Builtins → externals → internals, alphabetized, blank line between groups
- **Formatting**: Single quotes, no trailing commas, 4‑space indent, 200‑char width, semicolons

### Naming Conventions
| Item | Convention | Example |
|---|---|---|
| Variables/functions | `camelCase` | `getLocalhostAddress` |
| Types/interfaces | `PascalCase` | `HomeData`, `RouteItem` |
| Constants | `UPPER_SNAKE_CASE` | `SUCCESS_CODE` |
| Frontend components | `PascalCase` | `MediaList` |
| Frontend hooks | `use` prefix | `useIsMobile` |
| Frontend stores | `use` + `Store` suffix | `useSettingStore` |
| Video source store | `use` + `Store` suffix | `useVideoSourcesStore` |
| Backend handler functions | `handler` | `const handler = async (ctx) => { … }` |

### Git Workflow
- Husky + lint‑staged for pre‑commit hooks
- Commitlint enforces conventional commits (body 每行不超过 100 字符)
- `pnpm commit` for interactive commit messages
- **Commit Message Format**: 使用中文，body 逐文件列出变更，格式为：
  ```
  feat: 简要描述

  - path/to/file.tsx：该文件的具体变更说明，
    换行续写时保持缩进
  - path/to/other.ts：另一文件的变更说明

  Co-Authored-By: Claude <model> <noreply@anthropic.com>
  ```
  - 每行不超过 100 字符，超长则换行并缩进
  - 使用动词开头：新增、删除、重构、扩展、替换等
  - 涉及删除/替换时同时列出旧文件和新文件

### Code Quality Assurance
- **After generating code**: Always run `pnpm lint:fix` and `pnpm format` to ensure consistent style
- **Before committing**: Pre‑commit hooks automatically run linting and formatting
- **Type safety**: Run `pnpm typecheck` to verify TypeScript types across the monorepo

## Important Notes
- No test framework is configured in this project
- Backend uses ESM (`"type": "module"`)
- CMS handlers check `res.code === 1` for upstream success
- All error responses return `data: []` (empty array)
- Route handlers must never throw – always return structured response
- **Video Source Management**: Frontend manages video sources through `useVideoSourcesStore` (replaces old `useCmsStore`), with built-in sources in `apps/frontend/src/data/builtin-cms.json`
- **Proxy Routes**: Custom CMS addresses are dynamically handled through `/api/vodhub/proxy` using the CMS factory pattern
- **TMDB View**: Homepage supports TMDB/CMS dual-mode, toggled via SiteHeader; TMDB-only mode can skip CMS initialization entirely