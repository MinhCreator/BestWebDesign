export default async function handler(req, res) {
  const target = process.env.VITE_API_KEY;

  if (!target) {
    return res.status(500).json({ error: "PRIVATE_SERVER not configured" });
  }

  const apiPath = req.query.path || req.url.replace('/api/proxy', '/api');
  const url = `${target}${apiPath}`;

  const resp = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body:  req.body ? JSON.stringify(req.body) : undefined,
  });

  const data = resp.headers.get("content-type")?.includes("application/json")
    ? await resp.json()
    : await resp.text();

  // forward response back to the browser
  return res.status(resp.status).json(data);
}