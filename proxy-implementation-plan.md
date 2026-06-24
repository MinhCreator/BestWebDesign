# Serverless API Proxy — Implementation Plan

## Problem

`VITE_PRIVATE_SERVER` is inlined into the JS bundle at build time. Even with `sourcemap: false`, the private server URL is visible as a plain string in the minified JS — anyone can find it via DevTools or Network tab.

## Solution: Vercel Serverless Proxy

A thin Node.js proxy sits between the browser and the private backend. The frontend calls relative `/api/...` paths on the same Vercel domain. The proxy forwards requests using a **server-only** environment variable that never reaches the client.

```
Before (insecure):
  Browser ──→ https://your-app.vercel.app/static/js/main.js
                                      ↑
                              "https://private-server.com" inlined

After (secure):
  Browser ──→ /api/articles ──→ Vercel Proxy ──→ https://private-server.com/api/articles
               ↑                        ↑
          Relative path           process.env.PRIVATE_SERVER
          (no secret)             (server-only, never in bundle)
```

## Files to Create / Modify

### 1. Create `api/proxy.js` — Vercel Serverless Function

Path: `api/proxy.js`

```js
export default async function handler(req, res) {
  const target = process.env.PRIVATE_SERVER;

  if (!target) {
    return res.status(500).json({ error: "PRIVATE_SERVER not configured" });
  }

  const url = `${target}${req.url}`;
  const body = req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined;

  try {
    const resp = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = resp.headers.get("content-type")?.includes("application/json")
      ? await resp.json()
      : await resp.text();

    return res.status(resp.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Bad Gateway", detail: err.message });
  }
}
```

### 2. Update `vercel.json` — Proxy Route + SPA Fallback

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/proxy" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The `/api/(.*)` rule must come **before** the SPA catch-all so API requests hit the function instead of falling through to `index.html`.

### 3. Update `src/services/api.js` — Remove Env Var

```js
const BASE_URL = "";
```

### 4. Update `src/services/adminApi.js` — Remove Env Var

```js
const BASE_URL = "";
```

### 5. Update `src/components/ui/modal/Register.jsx` — Use Relative Path

Remove line 17 (`const apiUrl = import.meta.env.VITE_PRIVATE_SERVER || "";`), change line 18 from:
```js
const res = await fetch(`${apiUrl}/api/register`, {
```
to:
```js
const res = await fetch("/api/register", {
```

### 6. Clean up `.env` (optional for local dev)

Remove unused variables. Keep only the Vite dev proxy config:

```env
# Vite dev proxy handles /api → http://127.0.0.1:8000
# (configured in vite.config.js)
```

Or remove VITE_* vars entirely — dev still works via the Vite proxy.

## Verification Checklist

| Step | Action | Expected |
|------|--------|----------|
| 1 | `npm run build` | Build succeeds, no compile errors |
| 2 | Search dist output for private server URL | Not found |
| 3 | `vercel dev` (local) | API calls resolve through proxy |
| 4 | Deploy to Vercel | App functions without `VITE_PRIVATE_SERVER` |
| 5 | Set `PRIVATE_SERVER` in Vercel dashboard | Proxy forwards to backend |
| 6 | Check browser DevTools → Sources | No backend URL visible in any JS file |
| 7 | Check browser DevTools → Network | Requests go to `your-app.vercel.app/api/...` |

## Vercel Deployment Steps

1. Commit and push all changes
2. In Vercel dashboard → Project Settings → Environment Variables:
   - **Name:** `PRIVATE_SERVER`
   - **Value:** `https://your-backend-domain.com`
   - **Environments:** Production (and Preview if needed)
3. Redeploy (or wait for auto-deploy)
4. Verify all endpoints work

## Dev Workflow (Local)

Local development continues via Vite's built-in proxy (`vite.config.js` line 13-18) — no change needed.

## Files Summary

| File | Action | Reason |
|------|--------|--------|
| `api/proxy.js` | **Create** | Serverless proxy function |
| `vercel.json` | **Modify** | Add `/api/(.*)` → proxy route |
| `src/services/api.js` | **Modify** | Remove `VITE_PRIVATE_SERVER` reference |
| `src/services/adminApi.js` | **Modify** | Remove `VITE_PRIVATE_SERVER` reference |
| `src/components/ui/modal/Register.jsx` | **Modify** | Remove `VITE_PRIVATE_SERVER` reference |
| `.env` | **Modify** | Remove or comment out `VITE_PRIVATE_SERVER` |
