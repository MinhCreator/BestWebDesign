# Fix: "Unexpected token '<'" — Invalid JSON from Render

## Problem

When the frontend (Vercel) calls the backend (Render) at `https://bestwebdesignserver.onrender.com/`, the root path returns an **HTML 404 page** (`<!doctype html>...`) instead of JSON. The frontend's `.json()` calls crash with:

```
Unexpected token '<', "<!doctype "... is not valid JSON
```

## Root Causes

| Cause | File | Description |
|-------|------|-------------|
| 1 | `private_server/main.py` | **No root route** — `GET /` is not defined, Render returns HTML 404 |
| 2 | `BestWebDesign/vercel.json` | Vercel rewrite doesn't forward the captured API path, proxy constructs wrong URL |
| 3 | `BestWebDesign/src/api/proxy.js` | URL construction is fragile; no CORS headers |
| 4 | `BestWebDesign/src/services/api.js` | `.json()` call lacks `.catch()` fallback |
| 5 | `BestWebDesign/src/services/adminApi.js` | Success-path `.json()` call lacks `.catch()` fallback |
| 6 | `BestWebDesign/src/components/ui/modal/Register.jsx` | `.json()` call lacks `.catch()` fallback |

## Changes Made

### 1. Backend — Add root route (`private_server/main.py`)

**Added** `GET /` route returning JSON so Render never serves an HTML 404:

```python
@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "BestWebDesign API",
        "version": "1.0.0"
    }
```

### 2. Vercel rewrite — Forward captured path (`vercel.json`)

**Changed** rewrite destination from `/api/proxy` to `/api/proxy?path=$1` so the serverless function receives the original API path:

```json
{ "source": "/api/(.*)", "destination": "/api/proxy?path=$1" },
```

### 3. Proxy — Use forwarded path + CORS (`src/api/proxy.js`)

- Reads `req.query.path` (from rewrite) or strips `/api/proxy` prefix from `req.url`
- Properly normalizes URL (no double slashes)
- Forwards original query parameters
- Adds `Access-Control-Allow-Origin: *` header
- Uses safer content-type detection with `|| ""`

### 4. Frontend API — Add `.catch()` to `.json()` (`src/services/api.js`)

```js
return res.json().catch(() => { throw new ApiError("Invalid server response", res.status); });
```

(Already present — verified no change needed)

### 5. Admin API — Add `.catch()` to `.json()` (`src/services/adminApi.js`)

Line 31 success-path now has fallback:

```js
return res.json().catch(() => { throw new ApiError("Invalid server response", res.status); });
```

### 6. Register modal — Add `.catch()` to `.json()` (`src/components/ui/modal/Register.jsx`)

Success-branch now has fallback:

```js
const body = res.ok
  ? await res.json().catch(() => ({ detail: "Invalid server response" }))
  : { detail: "Registration failed" };
```

## Deployment Steps

### Step A — Deploy the backend (Render)

1. Push `private_server` changes to GitHub
2. Render auto-deploys from the repo
3. Verify:

```bash
curl https://bestwebdesignserver.onrender.com/
# → {"status":"ok","service":"BestWebDesign API","version":"1.0.0"}
```

### Step B — Set Vercel environment variable

In the Vercel dashboard (Project → Settings → Environment Variables), add:

| Name | Value | Environments |
|------|-------|-------------|
| `VITE_PRIVATE_SERVER` | `https://bestwebdesignserver.onrender.com` | Production, Preview, Development |

**Important:** No trailing slash.

### Step C — Deploy the frontend (Vercel)

1. Push `BestWebDesign` changes to GitHub
2. Vercel auto-deploys from the repo
3. Verify:

```bash
curl https://your-vercel-app.vercel.app/api/events
# → {"event-1":{...}}  (JSON, not HTML)
```

### Step D — Verify CORS

Ensure the CORS allow list in `private_server/main.py` includes the Vercel domain:

```python
canAccess = [
    "http://localhost:2007",
    "https://best-web-design-two.vercel.app",
    # add any custom domains here
]
```

## Verification Checklist

- [ ] `curl https://bestwebdesignserver.onrender.com/` returns JSON (not HTML)
- [ ] `curl https://bestwebdesignserver.onrender.com/api/events` returns JSON
- [ ] `curl https://your-vercel-app.vercel.app/api/events` returns JSON (through proxy)
- [ ] Registering for an event on the live site works without console errors
- [ ] Admin dashboard loads without "Unexpected token" errors
- [ ] Visit `https://bestwebdesignserver.onrender.com/` in browser — no crash
