

const BASE_URL = "";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status);
  }

  return res.json().catch(() => { throw new ApiError("Invalid response", res.status); });
}

function toArray(obj) {
  return obj && typeof obj === "object" ? Object.values(obj) : [];
}

export function fetchArticles() {
  return request("/api/articles").then(toArray);
}

export function fetchPosts(page = 1, limit = 4) {
  return request(`/api/posts/?start=${page}&end=${limit}`).then(toArray);
}

export function fetchEvents() {
  return request("/api/events").then(toArray);
}