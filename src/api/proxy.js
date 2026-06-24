export default async function handler(req, res) {
  const target = process.env.VITE_PRIVATE_SERVER;

  if (!target) {
    return res.status(500).json({ error: "PRIVATE_SERVER not configured" });
  }

  const apiPath = req.query.path || req.url.replace('/api/proxy', '/api');
  const queryString = req.url.includes('?') ? req.url.split('?').slice(1).join('?') : '';
  const url = `${target.replace(/\/+$/, '')}/${apiPath.replace(/^\/+/, '')}${queryString ? '?' + queryString : ''}`;

  const body = req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined;

  try {
    const resp = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const contentType = resp.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await resp.json()
      : await resp.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(resp.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Bad Gateway", detail: err.message });
  }
}