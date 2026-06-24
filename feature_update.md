# Feature Update: Per-Event Leaderboard

## 1. Overview

Transform the static `Rank.jsx` into a dynamic per-event leaderboard page, backed by a new API endpoint and connected to the event detail flow.

---

## 2. Backend API Contract

The external backend (proxied via `api/proxy.js` → `VITE_API_KEY`) must expose:

### `GET /api/results?event_id=<int>`

**Response shape:**
```json
[
  {
    "id": 1,
    "event_id": 1,
    "runner_name": "Li Wei",
    "nationality": "China",
    "time": "01:49:32",
    "avatar": "/Avatar/1.svg",
    "rank": 1
  },
  {
    "id": 2,
    "event_id": 1,
    "runner_name": "Yohan Blake",
    "nationality": "Jamaica",
    "time": "01:54:11",
    "avatar": "/Avatar/2.svg",
    "rank": 2
  }
]
```

Results are pre-sorted by the server; rank field is optional (client can derive from array order).

### Admin CRUD for results

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/results?event_id=<int>` | List results for an event |
| `POST` | `/api/admin/results` | Create result entry |
| `PUT` | `/api/admin/results/<id>` | Update result |
| `DELETE` | `/api/admin/results/<id>` | Delete result |

**POST/PUT body:**
```json
{
  "event_id": 1,
  "runner_name": "...",
  "nationality": "...",
  "time": "01:49:32",
  "avatar": "/Avatar/1.svg"
}
```

---

## 3. Frontend File Changes

### 3.1 New file: `src/hooks/useResults.js`

```jsx
import { useQuery } from "@tanstack/react-query";
import { fetchResults } from "../services/api";

export function useResults(eventId) {
  return useQuery({
    queryKey: ["results", eventId],
    queryFn: () => fetchResults(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}
```

### 3.2 Modify: `src/services/api.js`

Add:
```js
export function fetchResults(eventId) {
  return request(`/api/results?event_id=${eventId}`).then(toArray);
}
```

### 3.3 Modify: `src/services/adminApi.js`

Add:
```js
export function getAdminResults(eventId) {
  const query = eventId ? `?event_id=${eventId}` : "";
  return adminRequest(`/api/admin/results${query}`).then(data =>
    Array.isArray(data) ? data : Object.values(data || {})
  );
}

export function createResult(resultData) {
  return adminRequest("/api/admin/results", {
    method: "POST",
    body: JSON.stringify(resultData),
  });
}

export function updateResult(resultId, resultData) {
  return adminRequest(`/api/admin/results/${resultId}`, {
    method: "PUT",
    body: JSON.stringify(resultData),
  });
}

export function deleteResult(resultId) {
  return adminRequest(`/api/admin/results/${resultId}`, { method: "DELETE" });
}
```

### 3.4 Rewrite: `src/pages/Rank.jsx`

Replace static data with dynamic fetching. Use two modes:
- **Single-event mode** (`/Leaderboard/:eventId`) → show results for that event
- **All-events mode** (`/Leaderboard`) → show aggregated or let user select

Key changes:
- Read `eventId` from route params (`useParams()`)
- Fetch all events via `useEvents()` for the filter dropdown
- Fetch results via `useResults(eventId)`
- When no `eventId`, show a prompt or list of events to pick from
- Filter results by distance sub-filter (client-side)
- Render top-3 cards dynamically from `results.slice(0, 3)`
- Render table from `results.slice(3)` + top 3 duplicates in table
- Use flag images from `/Flags/{nationality.toLowerCase()}.svg`
- Use avatar images from data or default

**Architecture:**
```
Rank.jsx
├── Breadcrumbs
├── h1 (event name or "All Events")
├── FilterSection (event dropdown + distance dropdown)
├── Top3Podium (cards for rank 1, 2, 3)
│   ├── 2nd place (left)
│   ├── 1st place (center)
│   └── 3rd place (right)
└── ResultsTable
    ├── header (Rank / Name / Nation / Time)
    └── rows (all results including top 3)
```

### 3.5 Modify: `src/config/app.config.jsx`

Add route for per-event leaderboard:
```js
{
  name: "Event Leaderboard",
  path: "/Leaderboard/:eventId",
  component: Loadable(lazy(() => import("../pages/Rank"))),
  isDisableRoute: false,
  NavbarComp: false,
}
```

### 3.6 Modify: `src/style/Rank.css`

No structural changes needed — the existing CSS already supports dynamic content. Add optional loading/empty state styles if desired.

### 3.7 Modify: `src/components/event/EventList.jsx`

Add a "Leaderboard" button to each event card that navigates to `/Leaderboard/${event.id}`:
```jsx
import { useNavigate } from "react-router-dom";
// ...
const navigate = useNavigate();
// in the card bottom:
<button onClick={() => navigate(`/Leaderboard/${event.id}`)}>
  Leaderboard
</button>
```

---

## 4. Admin Panel: Results Management

### New file: `src/pages/admin/Results.jsx`

Admin page to manage results for events. Features:
- Select event from dropdown (fetches `getAdminEvents`)
- Show results table for selected event
- Add / Edit / Delete result entries
- Fields: runner_name, nationality, time, avatar (URL)

### Register in admin routes:

Add to `app.config.jsx`:
```js
{
  name: "Admin Results",
  path: "/admin/results",
  component: Loadable(lazy(() => import("../pages/admin/Results"))),
  isDisableRoute: false,
  NavbarComp: false,
}
```

Add `/admin/results` to the `adminPaths` array in `src/routes/route.jsx`.

Add a nav link in `AdminLayout`.

---

## 5. Data Flow Summary

```
User clicks "Leaderboard" on event card
  → navigate(`/Leaderboard/${event.id}`)
  → Rank.jsx reads eventId from URL params
  → useResults(eventId) fires GET /api/results?event_id=X
  → Data returns → rendered in podium + table

Admin manages results via /admin/results
  → Select event → GET /api/admin/results?event_id=X
  → CRUD operations on /api/admin/results/<id>
```

---

## 6. Implementation Order

1. Backend: `GET /api/results?event_id=` + admin CRUD for results
2. Frontend: `src/services/api.js` — add `fetchResults()`
3. Frontend: `src/services/adminApi.js` — add admin CRUD for results
4. Frontend: `src/hooks/useResults.js` — create custom hook
5. Frontend: `src/pages/Rank.jsx` — full rewrite with dynamic data
6. Frontend: `src/config/app.config.jsx` — add `/Leaderboard/:eventId` route
7. Frontend: `src/components/event/EventList.jsx` — add Leaderboard button
8. Frontend: `src/pages/admin/Results.jsx` — results management page
9. Frontend: `src/routes/route.jsx` — register admin results path

---

## 7. Server-Side Changes (`C:\Users\Administrator\Desktop\private_server\main.py`)

### 7.1 New Pydantic Model

Add after `EventModel` (line 136):

```python
class ResultModel(BaseModel):
    event_id: int
    runner_name: str
    nationality: str
    time: str
    avatar: str = ""
```

### 7.2 New File Constant

Add after `EVENTS_FILE` (line 26):

```python
RESULTS_FILE = f"{outputPath}/results.json"
```

### 7.3 New JSON Helpers

Add after `get_next_id()` (line 151):

```python
def load_results():
    if not Path(RESULTS_FILE).exists():
        return []
    with open(RESULTS_FILE, "r", encoding="utf-8") as f:
        content = f.read().strip()
        return json.loads(content) if content else []

def save_results(results):
    with open(RESULTS_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
```

### 7.4 Public Endpoint

Add after `get_event()` (after line 195):

```python
@app.get("/api/results")
async def get_results(event_id: int | None = None):
    results = load_results()
    if event_id is not None:
        results = [r for r in results if r["event_id"] == event_id]
    return {f"result-{r['id']}": r for r in sorted(results, key=lambda x: x["id"])}
```

> Returns a dict matching the `toArray()` convention in `src/services/api.js`. Results sorted by insertion order (oldest first = lowest rank).

### 7.5 Admin CRUD Endpoints

Add after `admin_get_events()` (after line 476). Follows the exact same pattern as admin event CRUD (lines 440–469):

```python
def get_next_result_id(results):
    return max((r["id"] for r in results), default=0) + 1


@app.post("/api/admin/results")
async def admin_create_result(data: ResultModel, payload: dict = Depends(require_admin)):
    results = load_results()
    new_result = data.model_dump()
    new_result["id"] = get_next_result_id(results)
    results.append(new_result)
    save_results(results)
    return {"status": "ok", "result": new_result}


@app.get("/api/admin/results")
async def admin_get_results(event_id: int | None = None, payload: dict = Depends(require_admin)):
    results = load_results()
    if event_id is not None:
        results = [r for r in results if r["event_id"] == event_id]
    return {f"result-{r['id']}": r for r in results}


@app.put("/api/admin/results/{result_id}")
async def admin_update_result(result_id: int, data: ResultModel, payload: dict = Depends(require_admin)):
    results = load_results()
    for i, r in enumerate(results):
        if r["id"] == result_id:
            updated = data.model_dump()
            updated["id"] = result_id
            results[i] = updated
            save_results(results)
            return {"status": "ok", "result": updated}
    raise HTTPException(status_code=404, detail="Result not found")


@app.delete("/api/admin/results/{result_id}")
async def admin_delete_result(result_id: int, payload: dict = Depends(require_admin)):
    results = load_results()
    for i, r in enumerate(results):
        if r["id"] == result_id:
            removed = results.pop(i)
            save_results(results)
            return {"status": "ok", "removed": removed}
    raise HTTPException(status_code=404, detail="Result not found")
```

### 7.6 Update Health Check

In the `GET /api/admin/health` endpoint (line 384), add a results check after the events block:

```python
    # Check results
    try:
        results_data = load_results()
        results["results"] = "ok"
    except Exception as e:
        results["results"] = f"offline: {str(e)}"
```

Also add to the cache block (around line 407):
```python
    "results_count": len(load_results())
```

And in `GET /api/admin/dashboard` (line 270), add:
```python
    try:
        results_data = load_results()
        stats["results"] = len(results_data)
    except:
        stats["results"] = 0
```

### 7.7 Data File

## 8. Enhanced Admin Form — Results Management (`src/pages/admin/Results.jsx`)

### 8.1 UX Improvements over Baseline CRUD

| Feature | Baseline | Enhanced |
|---------|----------|----------|
| **Nationality** | Free text input | Dropdown from `NATIONALITIES` array with flag icon preview |
| **Time entry** | Plain text | Auto-formatted input (`formatTimeInput` — strips non-digits, inserts colons at `MM:SS` or `HH:MM:SS`) |
| **Validation** | HTML `required` only | Per-field inline errors via `validate()` + `formErrors` state (name required, nationality required, time regex + range check) |
| **Rank reorder** | None (order = insertion) | `ChevronUp`/`ChevronDown` buttons per row — `moveUp(index)` / `moveDown(index)` to swap adjacent entries |
| **Delete** | `confirm()` dialog | DaisyUI modal overlay with runner name shown, stops propagation to dismiss on backdrop click |
| **Search** | None | Text filter runs client-side over `runner_name` + `nationality` |
| **Avatar** | Plain text field | Input + live 40×40 preview thumbnail with `onError` fallback |
| **Form panel** | Basic toggle form | Ring highlight (`ring-2 ring-primary/20`), close button in header, "Add Runner Result" primary CTA |
| **Empty states** | Single line | Contextual messages with emoji icon for no-event / loading / no-results / search-no-match |
| **Error display** | Inline `alert-error` | Dismissible alert with close button |
| **Table rank badge** | Plain number | `#1` gold, `#2` silver, `#3` bronze via Tailwind color classes; bold + larger font |
| **Row count + event context** | None | Header row shows "N runners for {Event Name}" with search bar |

### 8.2 Component Architecture

```
AdminResults
├── Event selector (dropdown + "Add Runner" button)
├── Create/Edit form panel (toggle via showForm state)
│   ├── Runner Name (input with error)
│   ├── Nationality (select + flag icon overlay)
│   ├── Time (auto-formatted input with HH:MM:SS helper)
│   └── Avatar URL (input + preview thumbnail)
├── Results table
│   ├── Header stats (count + event name + search)
│   ├── Row: Rank badge → Reorder buttons → Name → Nation (flag) → Time → Avatar → Edit/Delete
│   └── Empty state handlers (no event, loading, no results, search miss)
└── Delete modal (DaisyUI overlay, backdrop dismiss, confirm/cancel)
```

### 8.3 Key State Variables

```js
results        // full array from API — used for rank derivation
filtered       // client-side filtered subset for display (results.filter by search)
selectedEventId // drives fetchResults() via useEffect
showForm       // toggle form panel visibility
editingId      // null = create mode, number = edit mode
form           // { event_id, runner_name, nationality, time, avatar }
formErrors     // { runner_name?: string, nationality?: string, time?: string }
deleteTarget   // null or result object — triggers modal
search         // free-text filter
```

### 8.4 Helper Functions

```js
formatTimeInput(value)
// Strips non-digits, limits to 6 chars, inserts colons:
//   "1" → "1", "12" → "12", "123" → "1:23", "1234" → "12:34", "12345" → "12:34:5"

validateTime(value)
// Returns error string or "":
//   "" → "Time is required"
//   "abc" → "Invalid format"
//   "12:60" → "Seconds must be 0-59"
//   "12:34:60" → "Seconds must be 0-59"
//   "99:34:56" → valid (passes)

moveUp(index) / moveDown(index)
// Swaps array elements at index and index-1 / index+1
// Updates local results state (does not persist order — server returns by insertion order)
```

### 8.5 NATIONALITIES Reference Table

Defined as a module-level constant array with flag paths for auto-preview:

| Name | Flag SVG/PNG |
|------|-------------|
| Vietnam | `/Flags/vietnam.svg` |
| China | `/Flags/china.svg` |
| Japan | `/Flags/japan.svg` |
| Jamaica | `/Flags/Jamaica.svg` |
| USA | `/Flags/USA.svg` |
| Thailand | `/Flags/Thailand.png` |
| Kenya | — |
| Ethiopia | — |
| UK | — |
| France | — |
| +10 more | — |

Countries without SVG/PNG in `public/Flags/` use a fallback `?` badge. Add new `.svg` files to `public/Flags/` to enable flag preview.

### 8.6 Styling References

All DaisyUI classes. Key selectors:
- `.table` + `.table-zebra` for the ranked results table
- `.input-bordered` + `.input-error` (red border) for validation feedback
- `.btn-primary` / `.btn-error` / `.btn-ghost` for action hierarchy
- `.label` + `.label-text` for form field labels
- Fixed overlay with `bg-black/50` + `z-50` for delete modal

### 8.7 Future Enhancements (Not Yet Implemented)

- Drag-and-drop reorder (HTML5 drag API or `@dnd-kit`)
- Bulk paste from spreadsheet (TSV/CSV parse → `createResult` batch)
- CSV/PDF export of leaderboard
- Auto-save on reorder (debounced PUT request)
- Filter by distance when event has multiple distances
- Live preview of podium layout alongside the table

---

## 9. Data File

Results are stored at `output/results.json`. Example content:

```json
[
  {
    "id": 1,
    "event_id": 1,
    "runner_name": "Li Wei",
    "nationality": "China",
    "time": "01:49:32",
    "avatar": "/Avatar/1.svg"
  },
  {
    "id": 2,
    "event_id": 1,
    "runner_name": "Yohan Blake",
    "nationality": "Jamaica",
    "time": "01:54:11",
    "avatar": "/Avatar/2.svg"
  }
]
```
