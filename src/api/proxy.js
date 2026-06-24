export default async function handler(req, res) {
  const target = process.env.VITE_PRIVATE_SERVER;

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