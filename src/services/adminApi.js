const BASE_URL = import.meta.env.VITE_PRIVATE_SERVER || "/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem("admin_token");
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin/login";
    throw new ApiError("Unauthorized", 401);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.detail || `Request failed: ${res.status}`, res.status);
  }
  return res.json();
}

export function adminLogin(username, password) {
  return adminRequest("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getDashboard() {
  return adminRequest("/api/admin/dashboard");
}

export function getRegistrations() {
  return adminRequest("/api/admin/registrations");
}

export function deleteRegistration(index) {
  return adminRequest(`/api/admin/registrations/${index}`, { method: "DELETE" });
}

export function getAdminArticles() {
  return adminRequest("/api/admin/articles");
}

export function triggerCrawl(type) {
  return adminRequest(`/api/admin/crawl/${type}`, { method: "POST" });
}

export function clearCache() {
  return adminRequest("/api/admin/cache/clear", { method: "POST" });
}

// Get health routes
export function getAdminHealth() {
  return adminRequest("/api/admin/health");
}

export function getUsers() {
  return adminRequest("/api/admin/users");
}

export function createAdminUser(username, password, role, name) {
  return adminRequest("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({ username, password, role, name }),
  });
}

// Management event via admin dashboard
export function getAdminEvents(status) {
  const query = status ? `?status=${status}` : "";
  return adminRequest(`/api/admin/events${query}`);
}

export function createEvent(eventData) {
  return adminRequest("/api/admin/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export function updateEvent(eventId, eventData) {
  return adminRequest(`/api/admin/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
}

export function deleteEvent(eventId) {
  return adminRequest(`/api/admin/events/${eventId}`, { method: "DELETE" });
}
