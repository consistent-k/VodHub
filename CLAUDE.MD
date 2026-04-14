# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VodHub is a pnpm monorepo with two applications:
- **Backend** (`apps/backend`): Hono-based video aggregation API that normalizes multiple video source providers into a unified REST API (categories, search, details, playback). Node.js >= 24, ESM.
- **Frontend** (`apps/frontend`): Vite + React 19 + React Router video player application with Ant Design 6, Zustand state management, and multi-theme support.

## Common Development Commands

### Monorepo Commands (from root)
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start both backend and frontend dev servers
pnpm dev:backend          # Backend only (tsx watch)
pnpm dev:frontend         # Frontend only (vite dev)
pnpm lint                 # Lint all apps
pnpm lint:fix            # Lint with auto-fix
pnpm typecheck           # Type check all apps
pnpm format              # Prettier write
pnpm format:check        # Prettier check
pnpm commit              # Interactive conventional commit
```

### Backend-Specific Commands
```bash
pnpm --filter @vodhub/backend start     # Start backend without watch
pnpm --filter @vodhub/backend build     # Build backend (generates routes first)
pnpm --filter @vodhub/backend gen:routes # Generate route registry
```

### Frontend-Specific Commands
```bash
pnpm --filter @vodhub/frontend build    # Production build
pnpm --filter @vodhub/frontend preview  # Preview production build
```

## Backend Architecture

### Route System
- **URL Pattern**: `GET/POST /api/vodhub/<provider>/<action>`
- **Actions**: `home`, `homeVod`, `category`, `detail`, `play`, `search`
- **Auto-discovery**: Routes are automatically registered via `directory-import` in `apps/backend/src/routes/registry.ts`
- **Production optimization**: Routes are pre-generated to `registry.gen.ts` for faster startup

### Provider Types
1. **CMS Providers** (Recommended): Only need `namespace.ts` and `index.ts` using `createCMSRoutes()` factory
2. **Custom Providers**: Individual route files (`home.ts`, `category.ts`, etc.) with custom logic

### Middleware Order
1. `cors()` - CORS handling
2. `trimTrailingSlash()` - Trailing slash normalization  
3. `compress()` - Response compression
4. `jsonReturn` - JSON response serialization
5. `cache` - Redis/memory caching with deduplication

### Caching System
- Two-level cache: memory LRU + optional Redis via Keyv
- Deduplication: Prevents concurrent identical requests
- Cache key format: `vod-hub:redis-cache:${path}${bodyHash}`
- Error responses: Set `Cache-Control: no-cache` to prevent caching failures

### Error Handling Pattern
All handlers must follow this structure:
```typescript
try {
    logger.info(`${ACTION_MESSAGE.INFO} - ${namespace.name}`);
    const res = await someRequest();
    if (res.code === 1) {  // CMS convention
        return { code: SUCCESS_CODE, message: ACTION_MESSAGE.SUCCESS, data: [...] };
    }
    logger.error(`${ACTION_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
    return { code: ERROR_CODE, message: ACTION_MESSAGE.ERROR, data: [] };
} catch (error) {
    ctx.res.headers.set('Cache-Control', 'no-cache');
    logger.error(`${ACTION_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
    return { code: SYSTEM_ERROR_CODE, message: ACTION_MESSAGE.ERROR, data: [] };
}
```

**Status Codes**:
- `SUCCESS_CODE = 0` - Successful response
- `ERROR_CODE = -1` - Business logic error (upstream failure)
- `SYSTEM_ERROR_CODE = -2` - Exception/catch error

## Frontend Architecture

### Tech Stack
- **Framework**: Vite + React 19 + React Router + TypeScript
- **UI**: Ant Design 6 with SCSS Modules
- **State Management**: Zustand stores with `persist` middleware
- **Video Player**: xgplayer + HLS.js
- **Styling**: CSS variables for multi-theme support

### Theme System
Three built-in themes defined in `lib/themes/index.ts`:
- **midnight**: Dark with red accent
- **aurora**: Light with cyan accent  
- **cyber**: Dark with purple accent

**Key Rule**: All colors must use CSS variables (`var(--color-bg-container)`) - never hardcode hex/rgba values.

### State Management
- Stores in `lib/store/` with naming `use{Name}Store.ts`
- Zustand `persist` middleware for localStorage persistence
- Theme state updates both CSS variables and Ant Design theme config

### Component Structure
- Components are client-side by default (no `'use client'` directive needed)
- SCSS Modules with `vod-next-` class prefix (historical naming convention)
- Props defined with `interface` and destructured in params
- Components use `export default`

## Shared Types
Core types defined in `packages/shared/src/types/index.ts`:
- `Namespace` - Provider metadata
- `HomeData`, `HomeVodData`, `CategoryVodData` - Data structures
- `DetailData`, `PlayData`, `SearchData` - Response types
- `ApiResponse<T>` - Standard API response wrapper

## Deployment

### Docker Compose
- **Development**: `docker-compose up -d` (uses `docker-compose.yml`)
- **Production**: `docker-compose -f docker-compose.prod.yml up -d` (includes Redis, log persistence)

### Production Environment
- **Services**: frontend, backend, redis
- **Ports**: 3000→80 (frontend), 8888→8888 (backend), 6379→6379 (redis)
- **Environment Variables**: `REDIS_URL`, `CACHE_TTL`, `BANNED_KEYWORDS`
- **Log Persistence**: `./logs` mapped to `/app/apps/backend/logs`

## Development Standards

### Code Style
- **Backend**: Named exports only, `any` disallowed, `no-explicit-any: error`
- **Frontend**: `any` allowed, `export default` for components, named exports for utilities
- **Imports**: Builtins → externals → internals, alphabetized, blank line between groups
- **Formatting**: Single quotes, no trailing commas, 4-space indent, 200 char width, semicolons

### Naming Conventions
| Item | Convention | Example |
|---|---|---|
| Variables/functions | `camelCase` | `getLocalhostAddress` |
| Types/interfaces | `PascalCase` | `HomeData`, `RouteItem` |
| Constants | `UPPER_SNAKE_CASE` | `SUCCESS_CODE` |
| Frontend components | `PascalCase` | `VodList` |
| Frontend hooks | `use` prefix | `useIsMobile` |
| Frontend stores | `use` + `Store` suffix | `useSettingStore` |

### Git Workflow
- Husky + lint-staged for pre-commit hooks
- Commitlint enforces conventional commits
- `pnpm commit` for interactive commit messages

## Important Notes
- No test framework is configured in this project
- Backend uses ESM (`"type": "module"`)
- CMS handlers check `res.code === 1` for upstream success
- All error responses return `data: []` (empty array)
- Route handlers must never throw - always return structured response