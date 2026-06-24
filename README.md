<p align="center">
  <br>
  <br>
  <a href="https://best-web-design-two.vercel.app/" target="_blank" rel="noopener noreferrer" style="">
    <img src="resource\web_icon.svg" alt="current vite version badge" height="60">
  </a>
  <br>
  <br>
  <br>
</p>
<p align="center">
Community platform for endurance athletes — runners, cyclists, triathletes. Powered by vite
<p>
<p align="center">
  <a href=""><img src="https://img.shields.io/badge/Vite-v8-ffffff?logo=vite&style=for-the-badge&color=646CFF&logoColor=646CFF" alt="current vite version badge"></a>
  <a href=""><img src="https://img.shields.io/badge/React-v18-ffffff?logo=react&style=for-the-badge&color=ffffff&logoColor=61DAFB" alt="current react version badge"></a>
  <a href=""><img src="https://img.shields.io/badge/React%20router-v7-ffffff?logo=reactrouter&style=for-the-badge&color=ffffff&logoColor=CA4245" alt="current react router version badge"></a>
  <a href=""><img src="https://img.shields.io/badge/tailwindcss-v4-ffffff?logo=tailwindcss&style=for-the-badge&color=ffffff&logoColor=06B6D4" alt="current tailwindcss router version badge"></a>
  <a href=""><img src="https://img.shields.io/badge/fastapi-ffffff?logo=fastapi&style=for-the-badge&color=ffffff&logoColor=009688" alt="current fastapi version badge"></a>
  <a href='https://minhcreator.github.io/BestWebDesign/' target="_blank"><img alt='vite' src='https://img.shields.io/badge/Preview_Project-100000?style=for-the-badge&logo=vite&logoColor=FFD500&labelColor=B23BF7&color=078093'/></a>
<p>

<p align="center">
<a href="https://best-web-design-two.vercel.app/"><b>Get involved!</b></a>
</p>
<p align="center">
 <a href="https://minhcreator.github.io/BestWebDesign/">Project Preview</a> | <a href="https://best-web-design-two.vercel.app/">Checkout our website</a>
</p>
<br>
</p>

<p align="center">

Built with React 18 + Vite 8 + Tailwind CSS v4 + DaisyUI v5. Python FastAPI backend scrapes running news. Deployed on Vercel with serverless proxy.

</p>

## Tech Stack

| Layer            | What                                                               |
| ---------------- | ------------------------------------------------------------------ |
| **Framework**    | React 18, React Router v7, TanStack Query 5, Motion 12             |
| **Styling**      | Tailwind CSS v4, DaisyUI v5, clsx, tailwind-merge                  |
| **Icons**        | Lucide React (25+ icons)                                           |
| **Fonts**        | Inter, Outfit, Lexend (Google Fonts)                               |
| **Build**        | Vite 8 (`@tailwindcss/vite`, `@vitejs/plugin-react`)               |
| **HTTP**         | native Fetch (Axios installed but unused)                          |
| **Proxy (dev)**  | Vite dev server proxies `/api/*` → `http://127.0.0.1:8000`         |
| **Proxy (prod)** | `vercel.json` rewrite → `api/proxy.js` serverless function         |
| **Backend**      | FastAPI, PostgreSQL (private server)                               |
| **Scraper test** | Express 5, Cheerio                                                 |
| **Deploy**       | Vercel (SPA rewrites + serverless function)                        |

## Project Structure

```
src/                        # React application source (62 files)
├── assets/                 # Icons (19 SVGs), images (4), illustrations
│   ├── icon/               #   18 SVG icons + 2 PNG logos
│   └── image/              #   4 PNG images (hero, cycling, footwear, jogging)
├── components/             # 28 React components
│   ├── admin/              #   ProtectedRoute (auth guard)
│   ├── event/              #   EventList, FilterSection, Hero, MapSection, PassEvent
│   ├── form/               #   Registration form + validation + success dialog
│   ├── Home/               #   Hero, RaceSlider, CommunitySection, TrainingSection, Pagination
│   ├── news/               #   MainContent (mock), SideContent (tabs), Post (API)
│   └── ui/                 #   Navbar, BubbleNavbar, Footer, SearchBar,
│                           #   Breadcrumbs, Dialog, Loader, ProductCard,
│                           #   Modal/Register (direct POST form)
├── config/                 # app.config.jsx (13 route definitions)
├── context/                # AuthContext.jsx (login/logout/token)
├── hooks/                  # useArticles, usePosts, useEvents, useResults (TanStack Query)
├── layouts/                # Layout (public shell), AdminLayout (sidebar)
├── pages/                  # 6 public + 7 admin = 13 pages
│   ├── Home, News, Event, Rank, Team, Testing
│   └── admin/              # Login, Dashboard, Registrations, Events, Results,
│                           # Content, SystemHealth, Users
├── routes/                 # BrowserRouter + auth-aware routing
├── services/               # api.js (public fetch), adminApi.js (admin fetch + bearer)
├── shared/                 # Loadable (lazy-loaded HOC wrapper)
├── style/                  # 7 per-page CSS files
├── utility/                # ClassN() — clsx + tailwind-merge helper
└── views/                  # Spinner components (5 loading variants)

api/                        # Vercel serverless function
└── proxy.js                #   Body-parsing proxy to private backend

public/                     # Served at root by Vite
├── Avatar/                 # Runner avatars (10 files)
├── Flags/                  # National flags (8 files)
├── image/                  # Location photos (8 files)
├── video/                  # Background video (runner.mp4)
├── brand-logo.svg
└── network.png

test/                       # Legacy test files
├── crawl.js                # Express/Cheerio scraper test
├── EnvProcess.js           # Broken env processor (uses process.env)
└── Rank.tsx                # Broken TypeScript test (wrong paths)

root level
├── api/
│   └── proxy.js            # Vercel serverless proxy function
├── vercel.json             # Rewrite rules
├── vite.config.js          # Vite config + path aliases
├── auto_create_svg.py      # SVG paste-and-save CLI tool
├── setup-development.py    # Dev environment setup script
├── setup-build.py          # Production build script
└── project_workflow.html   # Interactive architecture diagram
```

**Backend** (`private server` — git-ignored, create locally):

```
backend/
├── main.py           # FastAPI app
├── scraper.py        # BeautifulSoup (irace.vn)
├── database.py       # SQLAlchemy + PostgreSQL
├── models.py         # ORM models
└── requirements.txt
```

## Features

- **Video hero** — Full-width background video with community stats overlay
- **Glassmorphism navbar** — Responsive hamburger menu + active route highlight
- **Bubble navbar** — Floating mini-nav appears on desktop scroll
- **Search bar** — Quick search across the platform
- **Running events** — Filter by type/distance/location. Embedded Google Map. Registration modal with validation.
- **Leaderboard** — Per-event dynamic leaderboard. Top-3 podium with avatars + flags + ranked table, sorted by time. Accessible from event cards or via `/Leaderboard/:eventId`. Built with TanStack Query (`useResults` hook).
- **News sidebar** — Tabbed sidebar: Latest News (from API) + Upcoming Races (static). Main content uses mock data.
- **Paginated tips** — Animated grid from `/api/posts/` (TanStack Query + Motion)
- **Community section** — Club cards, forum, activity feed
- **Training tools** — Training plan poster, pace calculator, progress analysis
- **Team page** — 4-member grid with social links
- **Lazy loading** — Code-split via React.lazy + Suspense + Loadable HOC
- **5 loading variants** — SVG loader, skeleton, CSS spinner, loading dots
- **Admin dashboard** — Protected routes with JWT token-based auth
  - Dashboard with stats (articles, posts, events, registrations, users, cache status)
  - Registrations CRUD (search, delete)
  - Events CRUD (create, read, update, delete, status toggle)
  - Results management (CRUD per-event runner results with time, nationality, avatar)
  - Content management (view articles, trigger re-crawl by type)
  - System health monitoring (endpoint status, clear cache)
  - User management (superadmin role, create admin users)
- **Vercel proxy** — Serverless function (`api/proxy.js`) parses raw body, forwards `Authorization`, uses `VITE_API_KEY` env
- **Dark mode support** — CSS variables + `@variant dark` in `global.css`

## Routes (15 total)

| Path                   | Page               | Access     | Component            |
| ---------------------- | ------------------ | ---------- | -------------------- |
| `/`                    | Home               | public     | `pages/Home`         |
| `/News`                | News               | public     | `pages/News`         |
| `/Event`               | Events             | public     | `pages/Event`        |
| `/Leaderboard`         | Rank (all events)  | public     | `pages/Rank`         |
| `/Leaderboard/:eventId`| Rank (per event)   | public     | `pages/Rank`         |
| `/Team`                | Team               | public     | `pages/Team`         |
| `/dev/Test`            | Testing            | public     | `pages/Testing`      |
| `/admin/login`         | Admin Login        | public     | `pages/admin/Login`  |
| `/admin/dashboard`     | Dashboard          | admin      | `pages/admin/Dashboard` |
| `/admin/registrations` | Registrations      | admin      | `pages/admin/Registrations` |
| `/admin/events`        | Events (admin)     | admin      | `pages/admin/Events` |
| `/admin/results`       | Results Manager    | admin      | `pages/admin/Results` |
| `/admin/content`       | Content Management | admin      | `pages/admin/Content` |
| `/admin/health`        | System Health      | admin      | `pages/admin/SystemHealth` |
| `/admin/users`         | User Management    | superadmin | `pages/admin/Users`  |

## API Endpoints (proxied via Vercel)

All requests use relative `/api/*` paths. Vercel rewrites `api/proxy.js` forwards to the private backend.

| Endpoint                     | Method   | Purpose                          | Auth     |
| ---------------------------- | -------- | -------------------------------- | -------- |
| `/api/articles`              | GET      | Fetch news articles              | —        |
| `/api/posts`                 | GET      | Fetch paginated blog posts       | —        |
| `/api/events`                | GET      | Fetch upcoming events            | —        |
| `/api/register`              | POST     | Event registration               | —        |
| `/api/admin/login`           | POST     | Admin authentication             | —        |
| `/api/admin/dashboard`       | GET      | Dashboard stats + cache          | Bearer   |
| `/api/admin/registrations`   | GET      | List registrations               | Bearer   |
| `/api/admin/registrations/N` | DELETE   | Delete registration              | Bearer   |
| `/api/admin/articles`        | GET      | List articles (admin)            | Bearer   |
| `/api/admin/crawl/{type}`    | POST     | Trigger news crawl               | Bearer   |
| `/api/admin/cache/clear`     | POST     | Clear backend cache              | Bearer   |
| `/api/admin/health`          | GET      | System health check              | Bearer   |
| `/api/admin/users`           | GET/POST | List / create admin users        | Bearer   |
| `/api/results`               | GET      | Fetch results (?event_id= filter)| —        |
| `/api/admin/events`          | GET      | List events (?status= filter)    | Bearer   |
| `/api/admin/events`          | POST     | Create event                     | Bearer   |
| `/api/admin/events/{id}`     | PUT      | Update event                     | Bearer   |
| `/api/admin/events/{id}`     | DELETE   | Delete event                     | Bearer   |
| `/api/admin/results`         | GET      | List results (?event_id= filter) | Bearer   |
| `/api/admin/results`         | POST     | Create result entry              | Bearer   |
| `/api/admin/results/{id}`    | PUT      | Update result                    | Bearer   |
| `/api/admin/results/{id}`    | DELETE   | Delete result                    | Bearer   |

## Setup

### Frontend

```bash
npm install
npm run dev        # Vite on port 2007
npm run build      # Prod build -> dist/
npm run preview    # Preview prod build
```

### Backend (runs separately on private server)

Not included in this repo. Python FastAPI with PostgreSQL, runs on a private server.

### Dev proxy

Vite dev server proxies `/api/*` → `http://127.0.0.1:8000` (configured in `vite.config.js`).

### Production proxy

`vercel.json` rewrites `/api/(.*)` → `/api/proxy?path=/api/$1`. The serverless function `api/proxy.js` reads the raw body and forwards to `process.env.VITE_API_KEY`.

### Full auto-setup

```bash
python setup-development.py   # Dev mode (npm install + venv)
python setup-build.py         # Production build
```

## Environment Variables

```env
VITE_API_KEY=          # Backend URL for Vercel proxy (set in Vercel dashboard)
VITE_PRIVATE_SERVER=   # Legacy — no longer used in bundle
```

Set `VITE_API_KEY` in **Vercel Dashboard → Project Settings → Environment Variables** (Production + Preview).

## Utilities

- `auto_create_svg.py` — CLI tool to paste SVG code and save as file
- `test/crawl.js` — Express/Cheerio scraper for test extraction
- `setup-development.py` — one-command dev environment setup
- `setup-build.py` — one-command production build
- `project_workflow.html` — Interactive SVG workflow diagram (open in browser)

## Known Issues

- `src/test/EnvProcess.js` still uses `process.env` — crashes in browser; should use `import.meta.env.VITE_*`
- `src/test/Rank.tsx` uses broken paths (`../images/` instead of `../assets/`)
- `styled-components`, `install`, `npm` packages in `package.json` are unused (legacy deps)
- `src/components/ui/ProductCard.jsx` appears unused (no shop page)
- `axios` in `package.json` is unused — all fetches use native `fetch`
- `src/components/news/MainContent.jsx` uses hardcoded mock data, not API
- `api/proxy.js` error message says `"PRIVATE_SERVER not configured"` but checks `VITE_API_KEY` — misleading

## License

[MIT](./license)
