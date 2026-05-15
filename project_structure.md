# ENDURANCE|HUB — Project Structure & Architecture Advice

## Current Tech Stack

| Layer | Tech | |
|-------|------|---|
| Frontend | React 18, Vite 8, React Router 7 | ✅ |
| Styling | Tailwind 4 + DaisyUI 5 + per-page CSS | ⚠️ |
| Animation | Motion 12 | ✅ |
| Icons | Lucide React + Material Symbols | ⚠️ |
| Backend | Python FastAPI + BeautifulSoup4 | ✅ |
| Language | JavaScript (JSX) | ⚠️ |

## Directory Tree

```
bestWebDesign-main/
├── public/
│   ├── Avatar/          Team images
│   ├── icon/            20 SVG icons
│   ├── image/           Product/hero images
│   ├── Event/           Static event page (standalone)
│   ├── New/             News static files
│   ├── Flags/           Country flag SVGs
│   └── Rank.html        Static leaderboard page
├── src/
│   ├── api/             Data-fetching components
│   ├── assets/          Static assets (SVG, PNG)
│   ├── components/
│   │   ├── event/       Event listing, filters, map, registration
│   │   ├── form/        Registration form + validation
│   │   ├── Home/        Landing page sections
│   │   ├── news/        News content + sidebar
│   │   └── ui/          Navbar, Footer, Dialog, Loader, Breadcrumbs
│   ├── config/          Route definitions, env
│   ├── layouts/         Layout shell (Nav + Outlet + Footer)
│   ├── pages/           Page components (5 routes)
│   ├── routes/          Router setup
│   ├── services/        (empty)
│   ├── shared/          Loadable HOC
│   ├── style/           Per-page CSS files
│   ├── utils/           ClassN utility
│   └── views/           Spinner/loader components
├── private/server/      FastAPI backend
└── snippets/            VS Code snippets
```

## Recommendations

### 1. Urgent Fixes

- **Remove `styled-components`** — installed but unused. `npm un styled-components`
- **Remove `install` and `npm` from dependencies** — accidental inclusions
- **Fix `jsconfig.json`** — `compilerOption` → `compilerOptions`
- **Fix bare `except:` in `main.py`** — should catch specific exceptions
- **Deduplicate loader components** — 4 loading components exist across `ui/` and `views/spinner/`. Pick one pattern and remove the rest
- **Remove `EnvProcess.js`** — logs `HOST`/`USER` to console; env vars already loaded by Vite

### 2. Architecture

- **Adopt TypeScript** — incremental migration (rename `.jsx` → `.tsx`, add types for props, API responses, route config). Catches bugs early, improves DX
- **Add API service layer** — extract `fetch()` calls from `useEffect` into `src/services/api.js` with a thin wrapper (base URL, error handling, typing). Use React Query (TanStack Query) for caching, loading states, dedup
- **Move hardcoded data to API** — team members, events, leaderboard data should come from the backend (or at least from `src/data/` JSON files)
- **Add `src/hooks/` directory** — extract reusable logic: `useFilters`, `usePagination`, `useScrollPosition`, `useFetch`

### 3. Styling

- **Migrate per-page CSS to Tailwind** — `src/style/Event.css` (343 lines), `News.css` (444 lines), etc. can be 80% replaced with Tailwind utilities + DaisyUI. Use `@apply` sparingly
- **Pick one icon system** — Lucide React is tree-shakeable; Material Symbols adds a CDN dependency. Standardize on Lucide
- **Consolidate design tokens** — many CSS custom properties in `global.css` are unused. Audit and trim

### 4. Routing & Pages

- **Remove `NavbarComp` from route config** — `app.config.jsx` route objects include `NavbarComp` but it's never read. Dead config
- **Consider lazy loading at route level only** — `Loadable` HOC is good. Keep as-is

### 5. Components

- **Rename `Pagination.jsx`** — it does data fetching + pagination. Split into `TipsGrid.jsx` (data display) + a reusable `Pagination` UI component in `ui/`
- **Move `Post.jsx` from `api/` to `components/news/`** — it's a News-specific data component, not a generic API utility
- **Move `ProductCard.jsx`** — if there's no shop page yet, either remove it or file it under a future `shop/` component group
- **Standardize on one `<dialog>` pattern** — DaisyUI modal vs native `<dialog>`. Pick one

### 6. Backend

- **Deduplicate scrapers** — `NewCrawl.py` and `tip_and_trick.py` share ~90% code. Create a base scraper class or shared `utils.py` functions
- **Add error handling** — try/except with logging, don't swallow exceptions
- **Add `/health` typo fix** — endpoint is `/heath`. Fix to `/health`
- **Add pagination as query params** — `/api/posts?page=1&limit=10` exists, but standardize all list endpoints

### 7. Testing

- **Set up Vitest** — Vite-native test runner. Start with unit tests for `utils.js`, then add component tests with React Testing Library
- **Add `npm run test:run`** — CI-friendly single-run command

### 8. Project Config

- **Review Vite path aliases** — many aliases defined in `vite.config.js` are unused. Keep only what's used
- **Move `public/` static pages** — `public/Rank.html` and `public/Event/template/event.html` are standalone pages. Either integrate into the SPA or keep as-is but document
- **Remove empty directories** — `src/services/`, `public/fonts/`, `test/` if unused

### 9. Future Considerations

- **SSR** — if SEO becomes important, migrate to Next.js or Astro. Current SPA is not search-engine friendly for content pages
- **Monorepo** — if backend grows, separate into `packages/frontend` and `packages/backend` with npm workspaces
- **CI/CD** — add GitHub Actions: lint → typecheck → test → build
- **API key management** — Google Maps key in `MapSection.jsx` is hardcoded. Use Vite env vars (`VITE_GOOGLE_MAPS_KEY`)

## Priority Matrix

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| 🔴 P0 | Remove unused deps, fix jsconfig | Low | High |
| 🔴 P0 | Fix bare except in backend | Low | High |
| 🟡 P1 | Add API service layer + React Query | Medium | High |
| 🟡 P1 | Move hardcoded data to API/JSON | Medium | Medium |
| 🟡 P1 | Deduplicate loader components | Low | Medium |
| 🟢 P2 | Adopt TypeScript incrementally | High | High |
| 🟢 P2 | Migrate per-page CSS → Tailwind | Medium | Medium |
| 🟢 P2 | Add Vitest + first tests | Medium | High |
| 🔵 P3 | Standardize icons (Lucide only) | Low | Low |
| 🔵 P3 | Rename Pagination → TipsGrid + Pagination UI | Low | Low |
| 🔵 P3 | SSR migration | High | Medium |
