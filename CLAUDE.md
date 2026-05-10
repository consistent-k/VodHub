# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VodHub is a pnpm monorepo with two applications:
- **Backend** (`apps/backend`): Hono‑based video aggregation API with a CMS proxy system and TMDB metadata integration, providing a unified REST API (categories, search, details, playback). Node.js ≥ 24, ESM.
- **Frontend** (`apps/frontend`): Vite + React 19 + React Router video player application with Ant Design 6, Zustand state management, multi‑theme support, integrated CMS management, and TMDB metadata integration.

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
pnpm format:check        # Prettier format check
pnpm commit              # Interactive conventional commit
pnpm build               # Build all apps (backend + frontend)
```

### Backend‑Specific Commands
```bash
pnpm --filter @vodhub/backend start     # Start backend without watch
pnpm --filter @vodhub/backend build     # Build backend (tsup)
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
- **URL Pattern**: `GET /api/vodhub/<module>/<action>`
- **Module Routes**: Explicitly registered in `apps/backend/src/app.tsx` (no auto-discovery)
- **Three route modules**:
  1. `/api/vodhub/config` – returns TMDB configuration (enabled status, API token presence)
  2. `/api/vodhub/cms` – CMS proxy system for custom video sources
  3. `/api/vodhub/tmdb` – TMDB metadata API (home, search, detail)

### Module Routes

#### Config (`/api/vodhub/config`)
- `GET /` – Returns `{ tmdb: { enabled: boolean, hasToken: boolean } }`

#### CMS Proxy (`/api/vodhub/cms`)
- `GET /proxy` – Proxies requests to user‑defined CMS URLs using `x-proxy-target` and `x-proxy-action` headers
- Supported actions: `home`, `homeVod`, `category`, `detail`, `play`, `search`
- All actions are GET requests; parameters are passed as query params
- Custom CMS URL is provided via the `x-proxy-target` header
- The `x-proxy-action` header determines which CMS handler to invoke

#### TMDB (`/api/vodhub/tmdb`)
- `GET /home` – Homepage categories (trending, popular movies/TV, now playing, upcoming, top rated, genres)
- `GET /search` – Multi-type search (`query`, `page` params)
- `GET /detail` – Movie/TV detail (`id`, `mediaType` params)

### Middleware Order
1. `cors()` – CORS handling (on cmsApp and tmdbApp)
2. `trimTrailingSlash()` – trailing slash normalization
3. `compress()` – response compression
4. `jsonReturn` – JSON response serialization
5. `cache` – Redis/memory caching with deduplication

Note: `logger()` is applied globally to the main Hono app. The config route only inherits the global logger.

### Caching System
- Two‑level cache: memory LRU + optional Redis via Keyv
- Deduplication: prevents concurrent identical requests
- Cache key format: `vod‑hub:redis‑cache:${path}${bodyHash}`
- Error responses: set `Cache‑Control: 'no‑cache'` to prevent caching failures
- GET requests with `Cache-Control: no-cache` header are not cached

### Error Handling Pattern
All CMS and TMDB handlers must follow this structure:
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

### Directory Structure
```
apps/backend/src/
├── api/
│   └── config/           # TMDB config API
├── modules/
│   ├── cms/proxy.ts      # CMS proxy router (single entry point for all CMS requests)
│   └── tmdb/
│       ├── app.ts        # TMDB router setup (home, search, detail sub-routes)
│       ├── client.ts     # TMDB client, normalization functions
│       ├── detail.ts     # TMDB detail handler
│       ├── home.ts       # TMDB homepage handler
│       ├── search.ts     # TMDB search handler
│       └── types.ts      # TMDB-specific types
├── types/
│   ├── cms.ts            # CMS-specific response types (CMSHomeData, CMSDetailData, etc.)
│   ├── error.ts          # Error type definitions
│   └── index.ts          # Type re-exports from @vodhub/shared
├── utils/
│   ├── cache/            # Cache utility (memory LRU + Redis via Keyv)
│   ├── cms/
│   │   ├── request.ts    # Axios instance and CMSResponse type for CMS API calls
│   │   ├── home/         # Home data handler for CMS proxy
│   │   ├── homeVod/      # HomeVod handler for CMS proxy
│   │   ├── category/     # Category handler for CMS proxy
│   │   ├── detail/       # Detail handler for CMS proxy
│   │   ├── play/         # Play handler for CMS proxy
│   │   └── search/       # Search handler for CMS proxy
│   ├── common-utils.ts   # Shared utility functions
│   ├── filters/          # Data filtering/normalization utilities
│   ├── format/           # Format utilities (e.g., vod content formatting)
│   ├── headers/          # HTTP header constants
│   └── logger/           # Logger utility
├── constant/
│   ├── code.ts           # Status codes (SUCCESS_CODE, ERROR_CODE, SYSTEM_ERROR_CODE)
│   ├── message.ts        # Action message constants
│   ├── userAgent.ts      # User-Agent strings
│   └── word.ts           # Word constants (e.g., banned keywords)
├── config/
│   └── index.ts          # Configuration (port, cache, banned keywords, TMDB settings)
├── app.tsx               # Main application, route registration
└── index.ts              # Application entry point
```

### CMS Proxy Pattern
The CMS proxy eliminates the need for hard‑coded route files per video source. Instead:
1. **Frontend** looks up the video source URL from `useVideoSourcesStore`
2. **Frontend** sends request to `/api/vodhub/cms/proxy` with:
   - `x-proxy-target` header: the CMS base URL
   - `x-proxy-action` header: the action (`home`, `homeVod`, `category`, `detail`, `play`, `search`)
   - Query parameters: action‑specific parameters
3. **Backend** proxy handler dispatches to the appropriate CMS utility function
4. **Backend** CMS utility makes the actual request to the target CMS and transforms the response

### Provider Types
1. **Custom CMS Providers**: User‑defined CMS sources managed via the frontend CMS management interface, dynamically proxied through the `/api/vodhub/cms/proxy` endpoint
2. **TMDB**: Built‑in metadata provider at `/api/vodhub/tmdb/` for movie/TV data (no traditional video source; used alongside CMS sources)

### Import Conventions
- **Groups**: Built‑ins → external packages → internal modules (`@/`), separated by blank lines
- **Alphabetization**: Imports within each group should be alphabetized (case‑insensitive)
- **Type imports**: Use `import type` for type‑only imports
- **Node built‑ins**: Use the `node:` prefix (e.g., `import { join } from 'node:path'`)

### Handler Naming
- CMS proxy handlers are named `handler` (constant) in each utility file
- TMDB route handlers are defined inline in each module's app.ts
- Use typed `RouteItem<T>` generic for route definitions where applicable

### Build Tooling
- Backend builds with **tsup** (ESM output, target Node 24, source maps enabled)
- `@vodhub/*` packages are bundled inline (`noExternal` in tsup config)

## Frontend Architecture

### Tech Stack
- **Framework**: Vite + React 19 + React Router + TypeScript
- **UI**: Ant Design 6 with CSS-in-JS (antd-style)
- **State Management**: Zustand stores with `persist` middleware
- **Video Player**: xgplayer + HLS.js
- **Styling**: CSS variables for multi‑theme support
- **TMDB**: `tmdb-ts` library for TMDB API integration

### Theme System
Three built‑in themes defined in `themes/index.ts`:
- **vercel**: light with dark primary (#171717)
- **airbnb**: light with Rausch red accent (#ff385c)
- **claude**: warm neutral palette with terracotta accent (#c96442)

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
- CSS-in-JS with antd-style (`createStyles`)
- Props defined with `interface` and destructured in params
- Components use `export default`

### HTTP Client
- `BaseRequest` class in `utils/request/index.ts` wraps Axios
- Default prefix: `/api/vodhub` (configurable via `customPreFix`)
- Custom API base URL read from localStorage key `vod_hub_api` (via `store2`)

### Error Handling
- **HTTP errors**: Rejected via fetch/HTTP client
- **API calls**: Wrap in try/catch, re‑throw as `Promise.reject`
- **UI errors**: Display with Ant Design `message` component

### Performance Guidelines
- Use `React.memo` to avoid unnecessary re‑renders
- Use `useMemo` and `useCallback` for expensive computations
- Use `React.lazy()` with `Suspense` for heavy components (e.g., video player)
- Use `Suspense` for async loading

### Video Source Management
- **Store**: `store/useVideoSourcesStore.ts` (Zustand + localStorage) — replaces old `useCmsStore` and `useVodSitesStore`
- **Data**: Built‑in and custom video sources unified under `VideoSource` type from `@vodhub/shared`
- **Features**:
  - Full CRUD for custom video sources
  - Enable/disable toggle for each source
  - Bulk import with overwrite or merge mode (URL‑based dedup)
  - Data persisted in localStorage

### CMS API Calls via Proxy
All CMS requests go through the proxy at `/api/vodhub/cms/proxy`:
- The `x-proxy-target` header carries the CMS base URL
- The `x-proxy-action` header specifies the action
- Query parameters pass action‑specific data (keyword, id, page, filters, etc.)
- Example: `GET /api/vodhub/cms/proxy?keyword=xxx&page=1` with `x-proxy-target: https://example.com` and `x-proxy-action: search`

### TMDB Integration
- **Config API**: `GET /api/vodhub/config` – returns TMDB enabled status and API token presence
- **TMDB API Base**: `/api/vodhub/tmdb/` with sub‑routes:
  - `GET /home` – Trending, popular (movies & TV), now playing, upcoming, top rated, genres
  - `GET /search?query=xxx&page=n` – Multi-type search
  - `GET /detail?id=n&mediaType=movie|tv` – Detailed info with credits, recommendations, similar
- **TMDB Stores**:
  - `useTmdbStore` – homepage data (trending/popular/now playing etc.)
  - `useTmdbDetailStore` – current TMDB item detail and related data
  - `useTmdbMatchStore` – TMDB-to-CMS match cache with 24h TTL, persisted to localStorage
- **TMDB Hooks** (`hooks/useTmdb.ts`):
  - `useTmdbHome` – batch fetch homepage categories
  - `useTmdbSearch` – multi-type search with debounce and request cancellation
  - `useTmdbDetail` – movie/TV detail fetch
- **TMDB Utils**:
  - `utils/tmdb.ts` – client management, image URL construction, Movie/TV data normalization
  - `utils/tmdb-match.ts` – parallel search across enabled CMS sources, cache results to matchStore
- **TMDB Components**:
  - `FeaturedCarousel` – hero carousel with background image, title, rating, overview
  - `SearchTmdb` – TMDB search with Cmd/Ctrl+K shortcut, auto-match CMS sources on click
  - `MediaList` – universal media list component supporting custom columns, badges, hover overlay
- **View Mode**: Site header has TMDB/CMS toggle button (shown when both API and TMDB token are configured)

### Key UI Components
| Component | Path | Purpose |
|---|---|---|
| `CmsManagement` | `components/CmsManagement/index.tsx` | Video source CRUD table (built‑in + custom) |
| `SiteHeader` | `components/SiteHeader/index.tsx` | Navigation with TMDB/CMS view toggle |
| `FeaturedCarousel` | `components/FeaturedCarousel/index.tsx` | Hero carousel for TMDB trending content |
| `MediaList` | `components/MediaList/index.tsx` | Universal media grid/list with load‑more |
| `SearchTmdb` | `components/SearchTmdb/index.tsx` | TMDB global search bar |
| `VodPalyer` | `components/VodPalyer/index.tsx` | Video player (xgplayer + HLS) |
| `VodSites` | `components/VodSites/index.tsx` | Video source site selector |
| `VodTypes` | `components/VodTypes/index.tsx` | Category/type selector |

### Pages
| Page | Path | Purpose |
|---|---|---|
| Home | `pages/home/index.tsx` | Main page (TMDB carousel + CMS content) |
| Category | `pages/category/index.tsx` | Category listing with filters |
| Detail | `pages/detail/index.tsx` | Video detail page |
| Setting | `pages/setting/index.tsx` | Settings (API URL, theme, video source management) |
| CMS | `pages/cms/index.tsx` | Video source management page |

## Shared Types

Core types defined in `packages/shared/src/types/index.ts`:
- `Namespace` – provider metadata (name, url?, description?)
- `HomeData`, `HomeVodData`, `CategoryVodData` – CMS data structures
- `DetailData`, `PlayData`, `SearchData` – CMS response types
- `ApiResponse<T>` – standard API response wrapper `{ code, message, data }`
- `Filter`, `FilterItem` – filter data types
- `VodPlayList`, `VodPlayUrl` – playlist types

Video source types defined in `packages/shared/src/types/video-source.ts`:
- `VideoSource` – unified type for both built‑in and custom video sources (id, name, url, description, enabled, createdAt, updatedAt)
- `CreateVideoSourceInput` / `UpdateVideoSourceInput` – CRUD input types
- `ImportVideoSourceItem` / `ImportMode` – bulk import types

## Deployment

### Docker Compose
- **Development**: `docker‑compose up ‑d` (uses `docker‑compose.yml`)
- **Production**: `docker‑compose ‑f docker‑compose.prod.yml up ‑d` (includes Redis, log persistence)

### Production Environment
- **Services**: frontend, backend, redis
- **Ports**: 3000→80 (frontend via nginx), 8888→8888 (backend), 6379→6379 (redis)
- **Environment Variables**: `REDIS_URL`, `CACHE_TTL`, `BANNED_KEYWORDS`, `TMDB_ENABLED`, `TMDB_API_TOKEN`
- **Log Persistence**: `./logs` mapped to `/app/apps/backend/logs`
- Frontend nginx config at `apps/frontend/conf/nginx.conf` handles SPA fallback and API proxy to backend

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- **ci.yml**: On push/PR to main – runs ESLint, TypeScript type check, Prettier format check, and commitlint (PRs only)
- **docker-image.yml**: On release – multi‑arch Docker build, pushes to DockerHub (`consistentlee/vod_hub`, `consistentlee/vod_next`)
- **audit.yml**: Weekly security audit (Mondays UTC 00:00)
- **dependency-review.yml**: Reviews dependency changes on PRs
- **labeler.yml**: Auto‑labels PRs (frontend, backend, styles, ci, dependencies)

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
| Frontend stores | `use` + `Store` suffix | `useVideoSourcesStore` |
| Backend handler functions | `handler` | `const handler = async (ctx) => { … }` |

### Git Workflow
- Husky hooks: `pre-commit` runs `lint-staged`, `commit-msg` runs `commitlint --edit`
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
- Backend uses ESM (`"type": "module"`), builds with tsup targeting Node 24
- CMS handlers check `res.code === 1` for upstream success
- All error responses return `data: []` (empty array) or `data: null` (for detail/single queries)
- Route handlers must never throw – always return structured response
- **Video Source Management**: Frontend manages video sources through `useVideoSourcesStore`, with built-in sources defined in the frontend
- **CMS Proxy**: Custom CMS addresses are dynamically handled through `/api/vodhub/cms/proxy` — no per‑source backend routes needed
- **TMDB View**: Homepage supports TMDB/CMS dual-mode, toggled via SiteHeader; TMDB-only mode can skip CMS initialization entirely
- NPM registry is overridden to Chinese mirror via `.npmrc` (`registry=https://registry.npmmirror.com/`)
- DevContainer available (`.devcontainer/devcontainer.json`) for isolated development