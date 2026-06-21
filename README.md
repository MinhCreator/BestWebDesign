# ENDURANCE|HUB

Community platform for endurance athletes — runners, cyclists, triathletes. Built with React 18 + Vite 8 + Tailwind CSS v4 + DaisyUI v5. Python FastAPI backend scrapes running news. Deployed on Vercel.

## Tech Stack

| Layer | What |
|-------|------|
| **Framework** | React 18, React Router v7, TanStack Query 5, Motion 12 |
| **Styling** | Tailwind CSS v4, DaisyUI v5, clsx, tailwind-merge |
| **Icons** | Lucide React, Material Symbols (Google Fonts) |
| **Fonts** | Inter, Outfit, Lexend (Google Fonts) |
| **Build** | Vite 8 (tailwindcss/vite plugin), ESLint (JS + React + JSON + CSS) |
| **HTTP** | Axios, native Fetch |
| **Backend** | FastAPI, BeautifulSoup4, Requests (web scraper — private server) |
| **Scraper test** | Express 5, Cheerio |
| **Deploy** | Vercel (SPA rewrites) |

## Project visualized 
<div style="position:center;"><a href='./project_workflow.html' target="_blank"><img alt='vite' src='https://img.shields.io/badge/Preview_Project-100000?style=for-the-badge&logo=vite&logoColor=FFD500&labelColor=B23BF7&color=078093'/></a></div>
## Project Structure

```
src/
├── api/              # API fetch components
├── assets/           # Static assets (icons, images, SVGs)
├── components/
│   ├── admin/        # ProtectedRoute (auth guard)
│   ├── Home/         # Hero, RaceSlider, Community, Training
│   ├── event/        # Event list, map, filter, registration
│   ├── form/         # Registration form + validation
│   ├── news/         # Article sidebar
│   └── ui/           # Navbar, BubbleNavbar, Footer, SearchBar,
│                     # Breadcrumbs, Dialog, Loader, ProductCard
├── config/           # Route definitions (13 routes)
├── context/          # AuthContext (login/logout/token)
├── hooks/            # useArticles, usePosts, useEvents
├── layouts/          # Layout (public), AdminLayout (admin)
├── pages/
│   ├── Home, News, Event, Rank, Team, Testing
│   └── admin/        # Login, Dashboard, Registrations, Events,
│                     # Content, SystemHealth, Users
├── routes/           # BrowserRouter + protected route logic
├── services/         # api.js (fetch), adminApi.js (axios + bearer)
├── shared/           # Loadable (lazy HOC)
├── style/            # Per-page CSS modules (7 files)
├── test/             # Test files
├── utility/          # clsx + tailwind-merge
└── views/            # Spinner, skeleton, loading states

public/               # Served at root by Vite
├── Avatar/           # Runner avatars (10 files)
├── Flags/            # National flags (8 files)
├── image/            # Location photos (7 files)
├── video/            # Background video (runner.mp4)
├── brand-logo.svg
└── network.png
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
- **Running events** — Filter by type/distance/location. Embedded Google Map. Registration form with validation.
- **Leaderboard** — Top-3 podium (avatars, flags) + ranked table (points, trend arrows)
- **News sidebar** — Articles from irace.vn via scraper API
- **Paginated tips** — Animated grid from `/api/posts/` (TanStack Query)
- **Community section** — Club cards, forum, activity feed
- **Training tools** — Training plan poster, pace calculator, progress analysis
- **Team page** — 4-member grid with social links
- **Lazy loading** — Code-split via React.lazy + Suspense + Loadable HOC
- **Multiple loaders** — SVG loader, skeleton, CSS spinner
- **Admin dashboard** — Protected routes with token-based auth
  - Dashboard with stats (registrations, events, crawl status)
  - Registrations CRUD
  - Events CRUD (create, read, update, delete)
  - Content management (re-crawl articles/posts)
  - System health monitoring + cache controls
  - User management (superadmin role)

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

### Full auto-setup

```bash
python setup-development.py   # Dev mode (Not included servers)
python setup-build.py         # Production build
```

Installs npm deps, creates Python venv, installs requirements, starts both servers.

## Environment Variables

```env
VITE_API_URL=
VITE_PRIVATE_SERVER=
```

Vite loads `.env` automatically. Prefix public vars with `VITE_`.

## API Proxy

Vite proxies `/api/*` -> `http://127.0.0.1:8000`. Backend CORS allows the dev origin.

## Routes (13 total)

| Path | Page | Access |
|------|------|--------|
| `/` | Home | public |
| `/News` | News | public |
| `/Event` | Events | public |
| `/Leaderboard` | Rank | public |
| `/Team` | Team | public |
| `/dev/Test` | Testing | public |
| `/admin/login` | Admin Login | public |
| `/admin/dashboard` | Dashboard | admin |
| `/admin/registrations` | Registrations | admin |
| `/admin/content` | Content Management | admin |
| `/admin/health` | System Health | admin |
| `/admin/users` | User Management | superadmin |
| `/admin/events` | Events (admin) | admin |

## Utilities

- `auto_create_svg.py` — CLI tool to paste SVG code and save as file
- `test/crawl.js` — Express/Cheerio scraper for test extraction
- `setup-development.py` — one-command dev environment setup
- `setup-build.py` — one-command production build

## Known Issues

- `src/config/EnvProcess.js` still uses `process.env` — crashes in browser; should use `import.meta.env.VITE_*`
- `src/test/Rank.tsx` uses broken paths (`../images/` instead of `../assets/`)
- `styled-components` in package.json is unused (legacy dep)
- `install` and `npm` packages in dependencies are unnecessary
- `src/components/ui/ProductCard.jsx` appears unused (no shop page)

## License

[MIT](./license)
