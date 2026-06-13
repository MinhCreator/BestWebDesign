# ENDURANCE|HUB

Community platform for endurance athletes. Built with React 18 + Vite 8 + Tailwind CSS v4 + DaisyUI v5. Python FastAPI backend scrapes running news.

## Tech Stack

| Layer | What |
|-------|------|
| Frontend | React 18, React Router v7, TanStack Query 5, Lucide React, Motion (Framer) |
| Styling | Tailwind CSS v4, DaisyUI v5, styled-components, Tailwind Merge, clsx |
| Fonts | Inter, Outfit, Lexend, Material Symbols (Google Fonts) |
| Build | Vite 8, ESLint (React + JSON + CSS) |
| Backend | FastAPI, BeautifulSoup4, Requests (web scraper) |
| Backend runs on | Python 3 + uvicorn |
| Other | Axios, Cheerio |

## Project Structure

```
src/
├── api/              # API fetch components
├── assets/           # Static assets (56 files)
│   ├── Avatar/       # Runner avatars for leaderboard
│   ├── Flags/        # National flag icons for leaderboard
│   ├── icon/         # UI icons (social, search, cart, nav)
│   └── image/        # Event & feature images (jpg, png, webp)
├── components/
│   ├── Home/         # Hero, RaceSlider, Community, Training
│   ├── event/        # Event list, map, registration, filter
│   ├── form/         # Registration form + validation
│   ├── news/         # Article sidebar
│   └── ui/           # Navbar, Footer, Breadcrumbs, Dialog, Loader, ProductCard
├── config/           # Route definitions
├── hooks/            # useArticles, usePosts
├── layouts/          # Shell layout (Nav + Outlet + Footer)
├── pages/            # Home, News, Event, Rank, Team
├── routes/           # BrowserRouter config
├── services/         # API client (axios/fetch)
├── shared/           # Loadable (lazy HOC)
├── style/            # Per-page CSS modules
├── test/             # Test files
├── utility/          # Class merging (clsx + tailwind-merge)
└── views/            # Spinner, skeleton, loading states

public/               # Static served assets
├── icon/             # Empty (reserved)
├── video/            # Background video runner.mp4
├── brand-logo.svg
└── network.png

**Backend** (`private server` — git-ignored, create locally):

## Features

- **Video hero** — Full-width bg video with community stats overlay
- **Glassmorphism navbar** — Responsive hamburger menu + active route highlight
- **Running events** — Filter by type/marathon/trial, location/distance. Embedded Google Map. Registration form with validation.
- **Leaderboard** — Top 3 podium (avatars) + ranked table (flags, points, trend arrows)
- **News sidebar** — Fetch articles from irace.vn via scraper API
- **Paginated tips** — Animated grid, fetch `/api/posts/`
- **Community section** — Club cards, forum, activity feed
- **Training tools** — Training Plan poster, Pace Calculator, Progress Analysis
- **Team page** — 4-member grid with social links
- **Lazy loading** — Code-split routes via React.lazy + Suspense
- **Multiple loaders** — SVG loader, skeleton, CSS spinner

## Setup

### Frontend

```bash
npm install
npm run dev        # Vite on port 2007
npm run build      # Prod build -> dist/
npm run preview    # Preview prod build
```

### Backend Not available in current project ( It run private)

### Full auto-setup

```bash
python setup-development.py   # Dev mode (both servers)
python setup-build.py         # Production build
```

Installs npm deps, creates Python venv, installs requirements, starts both servers.

## Environment Variables

```env
VITE_API_URL=
HOST=
USER=
VITE_PRIVATE_SERVER=
```

Vite loads `.env` automatically. Prefix public vars with `VITE_`.

## API Proxy

Vite proxies `{Your api url}` -> `{Your URL:PORT}`. Backend CORS allows `{Your URL:PORT}`.


## Utilities

- `auto_create_svg.py` — CLI tool to paste SVG code and save as file
- `test/crawl.js` — Express/Cheerio scraper to extract race articles (feature for testing)

## Known Issues

- `process.env` references in client code (`api.js`, `EnvProcess.js`, `Register.jsx`) crash in browser — use `import.meta.env.VITE_*` instead
- `src/style/home.css:53` `url("/image/hero.png")` broken — file is at `src/assets/image/hero.png`
- `src/pages/Rank.jsx:5-6` paths `public/Avatar`/`public/Flags` don't resolve — should point to `src/assets/`
- `src/test/Rank.tsx` uses `../images/` — should be `../assets/`

## License

[MIT](./license)
