# ENDURANCE|HUB

Community platform for endurance athletes. Built with React 18 + Vite 8 + Tailwind CSS v4 + DaisyUI v5. Python FastAPI backend scrapes running news.

## Tech Stack

| Layer | What |
|-------|------|
| Frontend | React 18, React Router v7, Lucide React, Motion (Framer) |
| Styling | Tailwind CSS v4, DaisyUI v5, styled-components, CSS modules |
| Build | Vite 8, ESLint v10 |
| Backend | FastAPI, BeautifulSoup4, Requests (web scraper) |
| Backend runs on | Python 3 + uvicorn |

## Project Structure

```
src/
├── api/            # API fetch components
├── components/     # UI + feature components
│   ├── Home/       # Hero, RaceSlider, Community, Training
│   ├── event/      # Event list, map, registration, filter
│   ├── form/       # Registration form + validation
│   ├── news/       # Article sidebar
│   └── ui/         # Navbar, Footer, Breadcrumbs, Dialog, Loader, ProductCard
├── config/         # Route definitions
├── layouts/        # Shell layout (Nav + Outlet + Footer)
├── pages/          # Home, News, Event, Rank, Team
├── routes/         # BrowserRouter config
├── shared/         # Loadable (lazy HOC)
├── style/          # Per-page CSS modules
├── utils/          # Class merging (clsx + tailwind-merge)
└── views/          # Spinner, skeleton, loading states

server/     # FastAPI backend
├── main.py         # Server entry
├── module/
│   ├── NewCrawl.py      # Scrape irace.vn articles
│   ├── tip_and_trick.py # Scrape posts
│   └── utilities.py     # helpers
└── output/         # Cached JSON
```

## Features

- **Video hero** - Full-width bg video with community stats overlay
- **Glassmorphism navbar** - Responsive hamburger menu + active route highlight
- **Running events** - Filter by type/marathon/trial, location/distance. Embedded Google Map. Registration form with validation.
- **Leaderboard** - Top 3 podium (avatars) + ranked table (flags, points, trend arrows)
- **News sidebar** - Fetch articles from irace.vn via scraper API
- **Paginated tips** - Animated grid, fetch `/api/posts/`
- **Community section** - Club cards, forum, activity feed
- **Training tools** - Training Plan poster, Pace Calculator, Progress Analysis
- **Team page** - 4-member grid with social links
- **Lazy loading** - Code-split routes via React.lazy + Suspense
- **Multiple loaders** - SVG loader, skeleton, CSS spinner

## Setup

### Frontend

```bash
npm install
npm run dev        # Vite on port 2007
npm run build      # Prod build -> dist/
npm run preview    # Preview prod build
```

### Backend

```bash
cd private/server
pip install -r requirements.txt
fastapi dev main.py   # API on port 8000

# Or scrape manually:
python module/NewCrawl.py
python module/tip_and_trick.py
```

### Full auto-setup

```bash
python setup.py
```

Installs npm deps, creates Python venv, installs reqs, starts both servers.

## API Proxy

Vite proxies `/api/*` -> `http://127.0.0.1:8000`. Backend CORS allows `localhost:2007`.

## .env

```
VITE_SERVER_URL=
```

## License

[MIT](./license)
