export default async function handler(req, res) {
  const target = process.env.VITE_API_KEY;

  if (!target) {
    return res.status(500).json({ error: "PRIVATE_SERVER not configured" });
  }

  // Read raw body from the incoming request
  const rawBody = await new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
  });

  const apiPath = req.query.path || req.url.replace('/api/proxy', '/api');
  const base = target.replace(/\/+$/, '');
  const path = apiPath.startsWith('/') ? apiPath : '/' + apiPath;
  const url = `${base}${path}`;

  try {
    const resp = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
      body: req.method !== "GET" ? rawBody || undefined : undefined,
    });

    const contentType = resp.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await resp.json()
      : await resp.text();

    return res.status(resp.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Backend unreachable", detail: err.message });
  }
}