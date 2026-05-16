# ENDURANCE|HUB — Project Structure & Architecture

## Tech Stack

| Layer          | Tech                                  |     |
| -------------- | ------------------------------------- | --- |
| Frontend       | React 18, Vite 8, React Router 7      | ✅  |
| Styling        | Tailwind 4 + DaisyUI 5 + per-page CSS | ⚠️  |
| Animation      | Motion 12                             | ✅  |
| Icons          | Lucide React                          | ✅  |
| State Mgmt     | TanStack React Query 5                | ✅  |
| HTTP           | Axios 1 + native fetch                | ⚠️  |
| Backend        | Python FastAPI + BeautifulSoup4       | ✅  |
| Backend (Node) | Express 5 (declared, unused?)         | ❓  |
| Language       | JavaScript (JSX)                      | ⚠️  |

## Directory Tree

```
bestWebDesign-main/
├── .agents/
│   └── skills/
│       ├── cavecrew/          SKILL.md, README.md
│       ├── caveman/           SKILL.md, README.md
│       ├── caveman-compress/  SKILL.md, README.md, SECURITY.md, scripts/*
│       ├── caveman-review/    SKILL.md, README.md
│       ├── caveman-stats/     SKILL.md, README.md
│       ├── expo-tailwind-setup/  SKILL.md
│       └── find-skills/       SKILL.md
├── server/
│   ├── main.py                FastAPI entry point
│   ├── requirements.txt
│   ├── module/
│   │   ├── __init__.py
│   │   ├── crawl_article.py
│   │   ├── NewCrawl.py
│   │   ├── tip_and_trick.py
│   │   └── utilities.py
│   ├── output/
│   │   ├── articles.json
│   │   ├── blog.json
│   │   └── post.json
│   └── .venv/                 Python virtual env
├── public/
│   ├── brand-logo.svg
│   ├── network.png
│   ├── Avatar/                10 team/athlete images
│   ├── Flags/                 8 flag SVGs/PNGs
│   ├── icon/                  20 icons (SVG + 1 PNG)
│   ├── image/                 12 product/hero images
│   └── video/                 runner.mp4
├── src/
│   ├── main.jsx / App.jsx / global.css
│   ├── api/
│   │   └── Post.jsx            Data-fetching component
│   ├── assets/                 8 static assets (SVG, PNG)
│   ├── components/
│   │   ├── event/              EventList, filterSection, Hero, MapSection, PassEvent
│   │   ├── form/               Form, LeftSide, RightSide, signForm
│   │   ├── Home/               CommunitySection, Hero, Pagination, RaceSlider, TrainingSection
│   │   ├── news/               MainContent, SideContent
│   │   └── ui/                 Breadcrumbs, BubbleNavbar, Dialog, Footer, Loader,
│   │                           Navbar, ProductCard, modal/Register
│   ├── config/                 app.config.jsx, .env, EnvProcess.js
│   ├── hooks/                  useArticles.js, usePosts.js (TanStack Query)
│   ├── layouts/                Layout.jsx (Nav + Outlet + Footer)
│   ├── pages/                  Event, Home, News, Rank, Team, Testing
│   ├── routes/                 route.jsx
│   ├── services/               api.js (fetch wrapper)
│   ├── shared/                 Loadable.jsx (HOC)
│   ├── style/                  7 per-page CSS files
│   ├── test/                   Rank.tsx
│   ├── utils/                  utils.js
│   └── views/spinner/          loader.css, Loader.jsx, Loading.jsx, spinner.css, Spinner.jsx
├── test/
│   └── crawl.js                Node scraper test
├── snippets/                   7 VS Code snippet files
├── auto_create_svg.py
├── eslint.config.js
├── favicon.svg
├── index.html
├── jsconfig.json
├── package.json
├── setup.py
├── skills-lock.json
└── vite.config.js
```

## What Changed Since Last Audit

| Change                                                               | Status           |
| -------------------------------------------------------------------- | ---------------- |
| `src/services/` now has `api.js` (fetch wrapper with error handling) | ✅ Fixed         |
| `src/hooks/` added with `useArticles`, `usePosts` (React Query)      | ✅ Fixed         |
| `test/` root dir added with `crawl.js`                               | ✅ Added         |
| `.agents/skills/` added (7 opencode skills)                          | ✅ Added         |
| `styled-components` still in deps but unused                         | ❌ Still present |
| `install` + `npm` still in deps                                      | ❌ Still present |
| 4 loader components still exist (`ui/Loader`, `views/spinner/*`)     | ❌ Not deduped   |
| `EnvProcess.js` still present                                        | ❌ Not removed   |
| `NavbarComp` still in route config                                   | ❌ Not removed   |

## Recommendations

### 1. Urgent Fixes

- **Remove `styled-components`** — installed but unused. `npm un styled-components`
- **Remove `install` and `npm` from deps** — accidental inclusions in `package.json`
- **Fix `jsconfig.json`** — `compilerOption` → `compilerOptions`
- **Fix bare `except:` in `main.py`** — catch specific exceptions
- **Deduplicate loaders** — 4 loading components across `ui/Loader.jsx` and `views/spinner/`. Pick one
- **Remove `EnvProcess.js`** — logs `HOST`/`USER` to console; env already loaded by Vite
- **Remove `Express` if unused** — declared in `package.json` but no Express server files found
- **Remove `cheerio` if unused** — Node scraping dep; all scraping is Python-side

### 2. Architecture

- **Adopt TypeScript** — incremental migration (rename `.jsx` → `.tsx`, add types)
- **Unify HTTP client** — `api.js` uses `fetch`, but `axios` is installed. Pick one
- **Move hardcoded data to API/JSON** — team, events, leaderboard should come from backend
- **Add `src/data/` directory** — for JSON fallbacks when backend is unavailable

### 3. Styling

- **Migrate per-page CSS to Tailwind** — `Event.css` (343 lines), `News.css` (444 lines), etc.
- **Consolidate design tokens** — audit unused CSS custom properties in `global.css`

### 4. Routing & Pages

- **Remove `NavbarComp` from route config** — `app.config.jsx` includes it but never read
- **Consider removing `Testing.jsx` page** — dev-only page shipped to production?

### 5. Components

- **Rename `Pagination.jsx`** — does data fetching + pagination. Split into `TipsGrid` + reusable `Pagination` UI
- **Move `Post.jsx` from `api/` to `components/news/`** — News-specific, not generic API utility
- **Move `ProductCard.jsx`** — no shop page yet; file under future `shop/` or remove
- **Standardize dialog pattern** — DaisyUI modal (`modal/Register`) vs native `<dialog>` (`Dialog.jsx`)

### 6. Backend

- **Deduplicate scrapers** — `NewCrawl.py` and `tip_and_trick.py` share ~90% code
- **Fix `/heath` typo** — endpoint is misspelled; should be `/health`
- **Add error handling** — try/except with logging everywhere
- **Standardize pagination** — `/api/posts?page=&limit=` exists; apply to all list endpoints

### 7. Testing

- **Set up Vitest** — Vite-native. Unit tests for `utils.js`, component tests with RTL
- **Add `npm run test:run`** — CI-friendly single-run command
- **Remove or integrate `test/crawl.js`** — orphaned Node scraper test

### 8. Project Config

- **Remove unused Vite path aliases** — many in `vite.config.js` are unused
- **Remove empty or stale dirs** — `src/test/` (single `.tsx` file), `test/` root
- **Remove `.agents/` from production builds** — opencode config shouldn't ship

### 9. Future Considerations

- **SSR** — Next.js or Astro for SEO on content pages
- **CI/CD** — GitHub Actions: lint → typecheck → test → build
- **API key management** — Google Maps key in `MapSection.jsx` is hardcoded. Use `VITE_GOOGLE_MAPS_KEY`

## Priority Matrix

| Priority | Action                                                     | Effort | Impact |
| -------- | ---------------------------------------------------------- | ------ | ------ |
| 🔴 P0    | Remove unused deps (`styled-components`, `install`, `npm`) | Low    | High   |
| 🔴 P0    | Fix bare `except` in backend                               | Low    | High   |
| 🔴 P0    | Fix `jsconfig.json` typo                                   | Low    | High   |
| 🟡 P1    | Deduplicate loader components                              | Low    | Medium |
| 🟡 P1    | Unify HTTP client (`fetch` vs `axios`)                     | Low    | Medium |
| 🟡 P1    | Move hardcoded data to API/JSON                            | Medium | Medium |
| 🟢 P2    | Adopt TypeScript incrementally                             | High   | High   |
| 🟢 P2    | Migrate per-page CSS → Tailwind                            | Medium | Medium |
| 🟢 P2    | Add Vitest + first tests                                   | Medium | High   |
| 🔵 P3    | Standardize icons (Lucide only)                            | Low    | Low    |
| 🔵 P3    | Rename Pagination → TipsGrid + Pagination UI               | Low    | Low    |
| 🔵 P3    | SSR migration                                              | High   | Medium |
