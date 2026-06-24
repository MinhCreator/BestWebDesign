## API Endpoints (proxied via Vercel)

All requests use relative `/api/*` paths. Vercel rewrites `api/proxy.js` forwards to the private backend.

| Endpoint                     | Method   | Purpose                          | Auth     |
| ---------------------------- | -------- | -------------------------------- | -------- |
| `/api/articles`              | GET      | Fetch news articles              | —        |
| `/api/posts`                 | GET      | Fetch paginated blog posts       | —        |
| `/api/events`                | GET      | Fetch upcoming events            | —        |
| `/api/results`               | GET      | Fetch results (?event_id= filter)| —        |
| `/api/register`              | POST     | Event registration               | —        |
| `/api/admin/login`           | POST     | Admin authentication             | —        |
| `/api/admin/dashboard`       | GET      | Dashboard stats + cache          | Bearer   |
| `/api/admin/registrations`   | GET      | List registrations               | Bearer   |
| `/api/admin/registrations/N` | DELETE   | Delete registration              | Bearer   |
| `/api/admin/articles`        | GET      | List articles (admin)            | Bearer   |
| `/api/admin/crawl/{type}`    | POST     | Trigger news crawl               | Bearer   |
| `/api/admin/cache/clear`     | POST     | Clear backend cache              | Bearer   |
| `/api/admin/health`          | GET      | System health check              | Bearer   |
| `/api/admin/users`           | GET/POST | List / create admin users        | Bearer   |
| `/api/admin/events`          | GET      | List events (?status= filter)    | Bearer   |
| `/api/admin/events`          | POST     | Create event                     | Bearer   |
| `/api/admin/events/{id}`     | PUT      | Update event                     | Bearer   |
| `/api/admin/events/{id}`     | DELETE   | Delete event                     | Bearer   |
| `/api/admin/results`         | GET      | List results (?event_id= filter) | Bearer   |
| `/api/admin/results`         | POST     | Create result entry              | Bearer   |
| `/api/admin/results/{id}`    | PUT      | Update result                    | Bearer   |
| `/api/admin/results/{id}`    | DELETE   | Delete result                    | Bearer   |