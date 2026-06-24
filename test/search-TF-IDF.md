# TF-IDF Symmetric Search — Implementation & Usage Guide

> **Symmetric search** = query and documents processed identically through the same tokenization, stopword removal, and TF-IDF vector space. This keeps the implementation lightweight, dependency-free, and predictable.

---

## 1. Project Scan — Current Search State

### Tech Stack
| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite 8 |
| Routing | react-router-dom v7 |
| Data fetching | @tanstack/react-query v5 |
| Styling | Tailwind CSS v4 + daisyUI v5 |
| Icons | lucide-react |
| State | Local `useState` (no global store) |

### Existing search touchpoints

| File | Lines | What it does | Problem |
|------|-------|-------------|---------|
| `src/components/ui/SearchBar.jsx` | 16 | Simple controlled input, no logic | Stateless shell |
| `src/components/event/filterSection.jsx` | 95 | Uses SearchBar for event filtering | Only passes string up |
| `src/components/event/EventList.jsx` | 74-81 | `String.includes()` substring filter | No ranking, no fuzzy, typo-sensitive |
| `src/pages/admin/Registrations.jsx` | 33-37 | Inline `String.includes()` on name/phone | Admin-only, substring-only |
| `src/hooks/useEvents.js` | — | Fetches events via react-query | No search integration |
| `src/hooks/useArticles.js` | — | Fetches articles via react-query | No search integration |
| `src/hooks/usePosts.js` | — | Fetches posts via react-query | No search integration |
| `src/services/api.js` | 39 | `fetchEvents()`, `fetchArticles()`, `fetchPosts()` | Raw API calls |
| `src/components/ui/Navbar.jsx` | 122 | Main navbar | **No search bar** |
| `src/routes/route.jsx` | 92 | Route config | **No `/search` route** |
| `src/config/app.config.jsx` | 101 | Route definitions | No search page entry |

### Current search flow (events only)
```
User types → FilterSection.handleSearchChange()
  → updates filters.searchQuery state
  → passes up to Event.jsx → EventList.jsx
  → EventList filters with:
      event.name.toLowerCase().includes(q) ||
      event.organizer.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q)
```

**Critical gaps:**
- No relevance ranking (results are just `true`/`false`)
- No cross-content search (events, articles, posts are isolated)
- No fuzzy matching (typo "maraton" → no results)
- No debounce (re-renders on every keystroke)
- Navbar has no global search entry point
- No dedicated search results page

---

## 2. Symmetric Search — Core Concept

**Symmetric search** means the search engine applies the **same transformation** to both the query string and every document. There is no special query parser, no separate embedding model for queries vs. documents.

```
  Query: "marathon da nang"
       ↓
  [tokenize → lowercase → remove stopwords → count term frequency]
       ↓
  TF-IDF vector for query

  Document: "Da Nang International Marathon 2026"
       ↓
  [tokenize → lowercase → remove stopwords → count term frequency]
       ↓
  TF-IDF vector for document

  Score = cosineSimilarity(queryVector, documentVector)
```

**Why symmetric matters for this project:**
- Events, articles, and posts all have short-to-medium text fields
- A single vector space means cross-content search "just works"
- No external API, no ML model, no GPU needed
- Runs entirely in the browser after initial data load

---

## 3. TF-IDF Engine — Full Implementation

Create `src/services/tfidf.js`:

```js
/**
 * TF-IDF Symmetric Search Engine
 * Zero dependencies — same pipeline for queries and documents.
 */

class TFIDF {
  constructor() {
    this.documents = [];
    this.vocabulary = new Set();
    this.docCount = 0;
    this.idfCache = {};
    this.dirty = true;
  }

  static STOPWORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
    "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
    "to", "was", "were", "will", "with", "this", "or", "but",
    "not", "we", "they", "i", "you", "do", "have", "what", "which",
    "who", "would", "could", "should", "about", "all", "can", "if",
    "no", "so", "up", "very", "just", "also", "more", "my", "than",
    "el", "la", "le", "en", "un", "une", "du", "des", "les",
  ]);

  /** Tokenize (symmetric — same for query and doc) */
  tokenize(text) {
    return String(text ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u024F\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => !TFIDF.STOPWORDS.has(t));
  }

  /** Add one document */
  add(id, fields) {
    const tokens = {};
    for (const value of Object.values(fields)) {
      for (const token of this.tokenize(value)) {
        tokens[token] = (tokens[token] ?? 0) + 1;
        this.vocabulary.add(token);
      }
    }
    this.documents.push({
      id,
      fields,
      tokens,
      length: Object.values(tokens).reduce((a, b) => a + b, 0),
    });
    this.docCount++;
    this.dirty = true;
  }

  /** Bulk add */
  addAll(items, idField, textFields) {
    for (const item of items) {
      const fields = {};
      for (const f of textFields) {
        fields[f] = item[f] ?? "";
      }
      this.add(item[idField], fields);
    }
  }

  /** Rebuild IDF cache */
  recomputeIDF() {
    this.idfCache = {};
    for (const term of this.vocabulary) {
      let df = 0;
      for (const doc of this.documents) {
        if (doc.tokens[term]) df++;
      }
      this.idfCache[term] = df === 0 ? 0 : Math.log(this.docCount / df);
    }
    this.dirty = false;
  }

  /** TF-IDF vector for a document */
  vector(doc) {
    if (this.dirty) this.recomputeIDF();
    const vec = {};
    if (doc.length === 0) return vec;
    for (const [term, count] of Object.entries(doc.tokens)) {
      const tf = count / doc.length;
      vec[term] = tf * (this.idfCache[term] ?? 0);
    }
    return vec;
  }

  /** Symmetric: query is processed as a mini-document */
  queryVector(query) {
    const tokens = this.tokenize(query);
    if (tokens.length === 0) return { tokens: [], vector: {}, length: 0 };
    const freq = {};
    for (const t of tokens) freq[t] = (freq[t] ?? 0) + 1;
    const qDoc = { tokens: freq, length: tokens.length };
    return { tokens, vector: this.vector(qDoc), length: tokens.length };
  }

  /** Cosine similarity */
  cosineSimilarity(vecA, vecB) {
    let dot = 0, magA = 0, magB = 0;
    for (const [term, val] of Object.entries(vecA)) {
      dot += val * (vecB[term] ?? 0);
      magA += val * val;
    }
    for (const val of Object.values(vecB)) magB += val * val;
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  /** Search — returns ranked results */
  search(query, topN = 20, minScore = 0.01) {
    if (!query?.trim()) return [];
    const { vector: qVec, length, tokens } = this.queryVector(query);
    if (length === 0 || tokens.length === 0) return [];

    const scores = [];
    for (const doc of this.documents) {
      let hasOverlap = false;
      for (const t of tokens) {
        if (doc.tokens[t]) { hasOverlap = true; break; }
      }
      if (!hasOverlap) continue;

      const sim = this.cosineSimilarity(qVec, this.vector(doc));
      if (sim >= minScore) {
        scores.push({ id: doc.id, score: sim, fields: doc.fields });
      }
    }

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topN);
  }

  /** Expose internal stats for debugging */
  stats() {
    return {
      documents: this.docCount,
      vocabulary: this.vocabulary.size,
      dirty: this.dirty,
    };
  }

  /** Clear and reindex */
  clear() {
    this.documents = [];
    this.vocabulary = new Set();
    this.docCount = 0;
    this.idfCache = {};
    this.dirty = true;
  }
}

let instance = null;
export function getSearchEngine() {
  if (!instance) instance = new TFIDF();
  return instance;
}

export default TFIDF;
```

---

## 4. Search Engine Initialization

Create `src/services/searchEngine.js`:

```js
import { getSearchEngine } from "./tfidf";
import { fetchEvents, fetchArticles, fetchPosts } from "./api";

let initialized = false;
let initPromise = null;

export async function initSearchEngine() {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const engine = getSearchEngine();

    const [events, articles, posts] = await Promise.all([
      fetchEvents().catch(() => []),
      fetchArticles().catch(() => []),
      fetchPosts(1, 9999).catch(() => []),
    ]);

    engine.addAll(events, "id", [
      "name", "organizer", "location", "type", "description",
    ]);
    engine.addAll(articles, "id", [
      "title", "content", "author",
    ]);
    engine.addAll(posts, "id", [
      "title", "content", "excerpt",
    ]);

    initialized = true;
    return engine;
  })();

  return initPromise;
}

export function searchAll(query, topN = 20) {
  const engine = getSearchEngine();
  return engine.search(query, topN);
}

export function getSearchStats() {
  const engine = getSearchEngine();
  return engine.stats();
}

export function resetSearchEngine() {
  const engine = getSearchEngine();
  engine.clear();
  initialized = false;
  initPromise = null;
}
```

---

## 5. Debounced Search Hook

Create `src/hooks/useSearch.js`:

```js
import { useState, useEffect, useRef } from "react";

export function useSearch(searchFn, query, options = {}) {
  const { debounceMs = 250, topN = 20, minLength = 2 } = options;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const latestQuery = useRef("");

  useEffect(() => {
    if (!query || query.trim().length < minLength) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const trimmed = query.trim();
    latestQuery.current = trimmed;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const hits = await Promise.resolve(searchFn(trimmed, topN));
        // Only accept if still the latest query
        if (latestQuery.current === trimmed) {
          setResults(hits);
        }
      } catch (err) {
        if (latestQuery.current === trimmed) {
          setError(err.message);
          setResults([]);
        }
      } finally {
        if (latestQuery.current === trimmed) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, searchFn, topN, minLength]);

  return { results, loading, error };
}
```

---

## 6. Updating the SearchBar Component

Replace `src/components/ui/SearchBar.jsx`:

```js
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchAll, initSearchEngine } from "../../services/searchEngine";
import { useSearch } from "../../hooks/useSearch";

const SearchBar = ({ value, onChange, placeholder, classNameStyle, autoFocus, onSelect }) => {
  const [query, setQuery] = useState(value ?? "");
  const [showResults, setShowResults] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const selectedIndexRef = useRef(-1);

  useEffect(() => {
    initSearchEngine()
      .then(() => setEngineReady(true))
      .catch(() => {});
  }, []);

  const { results, loading } = useSearch(searchAll, query, {
    debounceMs: 300,
    topN: 8,
  });

  const handleChange = useCallback((val) => {
    setQuery(val);
    onChange?.(val);
    setShowResults(val.trim().length > 0);
    selectedIndexRef.current = -1;
  }, [onChange]);

  const handleSelect = useCallback((result) => {
    setShowResults(false);
    setQuery(result.fields.name ?? result.fields.title ?? "");
    onSelect?.(result);
    if (result.fields._type === "event") {
      navigate(`/Event`);
    } else if (result.fields._type === "article") {
      navigate(`/News`);
    }
  }, [navigate, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (!showResults || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndexRef.current = Math.min(
        selectedIndexRef.current + 1,
        results.length - 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
    } else if (e.key === "Enter" && selectedIndexRef.current >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndexRef.current]);
    } else if (e.key === "Escape") {
      setShowResults(false);
      inputRef.current?.blur();
    }
  }, [showResults, results, handleSelect]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder={placeholder || "Search events, articles, tips..."}
          autoFocus={autoFocus}
          className={`w-full rounded-lg border py-2 pl-8 pr-3 text-sm focus:outline-none ${
            classNameStyle ?? "border-gray-300 focus:border-[#55b576] focus:ring-2 focus:ring-[#55b576]/20"
          }`}
          aria-label="Search"
          aria-expanded={showResults}
          aria-autocomplete="list"
          role="combobox"
        />
        {loading && (
          <span className="absolute right-3 text-gray-400">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        {!loading && query && (
          <button
            onClick={() => { setQuery(""); onChange?.(""); setShowResults(false); }}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
          role="listbox"
        >
          {!engineReady ? (
            <div className="p-3 text-sm text-gray-400 text-center">
              Initializing search...
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-3 text-sm text-gray-400 text-center">
              No results found
            </div>
          ) : (
            results.map((r, i) => (
              <div
                key={r.id}
                role="option"
                aria-selected={i === selectedIndexRef.current}
                className={`p-3 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                  i === selectedIndexRef.current
                    ? "bg-[#55b576]/10"
                    : "hover:bg-gray-50"
                }`}
                onMouseDown={() => handleSelect(r)}
                onMouseEnter={() => { selectedIndexRef.current = i; }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {r.fields.name ?? r.fields.title ?? `Item #${r.id}`}
                  </div>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                    style={{
                      backgroundColor:
                        r.fields._type === "event" ? "#dcfce7" :
                        r.fields._type === "article" ? "#dbeafe" : "#fef3c7",
                      color:
                        r.fields._type === "event" ? "#166534" :
                        r.fields._type === "article" ? "#1e40af" : "#92400e",
                    }}
                  >
                    {r.fields._type ?? "item"}
                  </span>
                </div>
                {r.fields.location && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {r.fields.location}
                  </div>
                )}
                <div className="text-xs text-gray-300 mt-0.5">
                  Relevance: {(r.score * 100).toFixed(0)}%
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
```

---

## 7. Adding Search to the Navbar

Add the SearchBar into `src/components/ui/Navbar.jsx`.

**Insert after the logo block (around line 35) and before the nav links:**

```js
import SearchBar from "./SearchBar";

// Inside the header, after the logo div and before collapseMenu:
<div className="hidden lg:flex flex-1 max-w-md mx-4">
  <SearchBar
    value=""
    onChange={(val) => {
      if (val.trim()) navigate(`/search?q=${encodeURIComponent(val.trim())}`);
    }}
    placeholder="Search site..."
    classNameStyle="border-gray-300 bg-gray-50 focus:bg-white"
  />
</div>
```

---

## 8. Search Results Page

Create `src/components/search/SearchResults.jsx`:

```js
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { initSearchEngine, searchAll, getSearchStats } from "../../services/searchEngine";
import { useSearch } from "../../hooks/useSearch";
import SearchBar from "../ui/SearchBar";

const TYPE_COLORS = {
  event: { bg: "#dcfce7", text: "#166534", label: "Event" },
  article: { bg: "#dbeafe", text: "#1e40af", label: "Article" },
  post: { bg: "#fef3c7", text: "#92400e", label: "Post" },
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [engineReady, setEngineReady] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    initSearchEngine()
      .then(() => {
        setEngineReady(true);
        setStats(getSearchStats());
      })
      .catch(() => {});
  }, []);

  const { results, loading } = useSearch(searchAll, query, {
    debounceMs: 200,
    topN: 50,
  });

  const handleSearch = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSelect = (result) => {
    if (result.fields._type === "event") navigate("/Event");
    else if (result.fields._type === "article") navigate("/News");
  };

  const grouped = results.reduce((acc, r) => {
    const type = r.fields._type ?? "item";
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={handleSearch}
                placeholder="Search events, articles, tips..."
                autoFocus={!initialQuery}
                classNameStyle="border-gray-300 bg-gray-50"
              />
            </div>
          </div>
          {stats && engineReady && (
            <div className="text-xs text-gray-400 mt-2">
              Indexed {stats.documents} documents · {stats.vocabulary} terms
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!query.trim() ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg">Type something to search</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#55b576]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No results for "{query}"</p>
            <p className="text-sm mt-2">Try different keywords or check spelling</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </div>

            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  {type.charAt(0).toUpperCase() + type.slice(1)}s ({items.length})
                </h2>
                <div className="space-y-2">
                  {items.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleSelect(r)}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#55b576] hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {r.fields.name ?? r.fields.title ?? `Item #${r.id}`}
                          </h3>
                          {r.fields.location && (
                            <p className="text-sm text-gray-500 mt-1">
                              {r.fields.location}
                            </p>
                          )}
                          {r.fields.organizer && (
                            <p className="text-sm text-gray-400 mt-0.5">
                              by {r.fields.organizer}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: TYPE_COLORS[type]?.bg ?? "#f3f4f6",
                              color: TYPE_COLORS[type]?.text ?? "#374151",
                            }}
                          >
                            {TYPE_COLORS[type]?.label ?? type}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-[#55b576] h-1 rounded-full transition-all"
                          style={{ width: `${Math.min(r.score * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Relevance</span>
                        <span>{(r.score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
```

---

## 9. Register the Search Route

Add to `src/config/app.config.jsx`:

```js
{
  name: "Search",
  path: "/search",
  component: Loadable(lazy(() => import("../components/search/SearchResults"))),
  isDisableRoute: false,
  NavbarComp: false,
},
```

Add the import for the search results page (near other lazy imports):

```js
// Already in file — just add to the Routes array
```

The route renderer in `src/routes/route.jsx` will automatically pick it up since it iterates `AppConfig.Routes` for public routes.

---

## 10. Tagging Documents by Type

When adding documents to the search index, tag each one with a `_type` field so results can show contextual badges.

Modify `src/services/searchEngine.js` — in the `initSearchEngine` function, add `_type` to each item's fields:

```js
engine.addAll(
  events.map((e) => ({ ...e, _type: "event" })),
  "id",
  ["name", "organizer", "location", "type", "description", "_type"]
);
engine.addAll(
  articles.map((a) => ({ ...a, _type: "article" })),
  "id",
  ["title", "content", "author", "_type"]
);
engine.addAll(
  posts.map((p) => ({ ...p, _type: "post" })),
  "id",
  ["title", "content", "excerpt", "_type"]
);
```

---

## 11. EventList — Upgrade to TF-IDF

Replace the substring filter in `src/components/event/EventList.jsx` (lines 74-81):

```js
import { searchAll, initSearchEngine } from "../../services/searchEngine";

// Inside EventList component, add state:
const [searchResults, setSearchResults] = useState(null);
const [searchEngineReady, setSearchEngineReady] = useState(false);

useEffect(() => {
  initSearchEngine().then(() => setSearchEngineReady(true));
}, []);

// Replace the old substring filter with:
const filteredEvents = useMemo(() => {
  let list = events.filter((event) => event.status === "running");

  // Apply non-search filters
  if (filters.type !== "all") list = list.filter((e) => e.type === filters.type);
  if (filters.location) list = list.filter((e) => e.location === filters.location);
  if (filters.distance) list = list.filter((e) => e.distance === filters.distance);

  // Apply TF-IDF search scoring
  if (filters.searchQuery?.trim() && searchEngineReady) {
    const hits = searchAll(filters.searchQuery, 50);
    const hitIds = new Set(hits.map((h) => h.id));
    const scoreMap = new Map(hits.map((h) => [h.id, h.score]));
    return list
      .filter((e) => hitIds.has(e.id))
      .sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
  }

  return list;
}, [events, filters, searchEngineReady]);
```

---

## 12. Admin Registrations — Optional Upgrade

In `src/pages/admin/Registrations.jsx`, the current substring search (lines 33-37) is sufficient for admin name/phone lookup. Upgrading to TF-IDF here is unnecessary because:
- Name and phone are short, exact-match fields
- Admin users expect substring matching for phone numbers
- TF-IDF would degrade phone search (tokenization breaks "0905123456" into one token anyway)

**Keep as-is** unless cross-field relevance ranking is needed.

---

## 13. CSS Styling for Search Components

Add to `src/global.css` (or relevant CSS file):

```css
/* Search dropdown animations */
@keyframes searchFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.search-dropdown-enter {
  animation: searchFadeIn 0.15s ease-out;
}

/* Search results page — relevance bar */
.relevance-bar {
  transition: width 0.3s ease;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .search-dropdown-mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: white;
    padding: 1rem;
  }
}

/* Scrollbar for dropdown */
.search-dropdown-scroll::-webkit-scrollbar {
  width: 4px;
}
.search-dropdown-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
```

---

## 14. Complete File Creation Checklist

| # | Action | File | Status |
|---|--------|------|--------|
| 1 | Create TF-IDF engine | `src/services/tfidf.js` | New |
| 2 | Create search engine init | `src/services/searchEngine.js` | New |
| 3 | Create search hook | `src/hooks/useSearch.js` | New |
| 4 | Create search results page | `src/components/search/SearchResults.jsx` | New |
| 5 | Rewrite SearchBar component | `src/components/ui/SearchBar.jsx` | Replace |
| 6 | Add SearchBar import to Navbar | `src/components/ui/Navbar.jsx` | Edit |
| 7 | Add /search route to config | `src/config/app.config.jsx` | Edit |
| 8 | Upgrade EventList filter | `src/components/event/EventList.jsx` | Edit |
| 9 | Add _type tagging | `src/services/searchEngine.js` | Edit |
| 10 | Add CSS to global styles | `src/global.css` | Edit |

---

## 15. Performance Considerations

| Factor | Impact | Mitigation |
|--------|--------|------------|
| Index size | ~50-200 events + articles + posts | Load once, cache in memory |
| IDF recomputation | O(V × D) where V = vocab, D = docs | Only on `add`; lazy via `dirty` flag |
| Per-query vector | O(T × V) where T = query tokens | Query is usually 2-5 words; negligible |
| Cosine similarity | O(V) per doc | With 200 docs and 500 vocab, ~100K ops — under 5ms |
| Debounce | Prevents excessive computation | 250-300ms default |

**Zero-dependency client-side search is viable up to ~10,000 documents.** Beyond that, consider:
- Web Worker offloading (`src/services/tfidf.worker.js`)
- Server-side search (Postgres full-text, Elasticsearch, Meilisearch)

---

## 16. Testing Strategy

### Unit tests (vitest or jest)
```js
// src/services/__tests__/tfidf.test.js
import TFIDF from "../tfidf";

describe("TFIDF", () => {
  it("tokenizes symmetrically (same for query and doc)", () => {
    const engine = new TFIDF();
    const tokens = engine.tokenize("Da Nang Marathon");
    expect(tokens).toContain("da");
    expect(tokens).toContain("nang");
    expect(tokens).toContain("marathon");
  });

  it("ranks exact match highest", () => {
    const engine = new TFIDF();
    engine.add("1", { name: "Da Nang Marathon", location: "Da Nang" });
    engine.add("2", { name: "Hai Van Pass", location: "Hue" });
    const results = engine.search("Da Nang Marathon");
    expect(results[0].id).toBe("1");
    expect(results[0].score).toBeGreaterThan(0);
  });

  it("returns empty for stopword-only queries", () => {
    const engine = new TFIDF();
    engine.add("1", { name: "Marathon Event" });
    expect(engine.search("the and of")).toEqual([]);
  });

  it("handles empty documents gracefully", () => {
    const engine = new TFIDF();
    expect(engine.search("test")).toEqual([]);
  });
});
```

### Integration tests
- Open search page, type query, verify results render
- Navigate through keyboard arrows and Enter
- Click outside dropdown to close
- Verify no results state for gibberish input

---

## 17. Accessibility (ARIA) Compliance

The updated SearchBar component includes:
- `role="combobox"` on the input
- `role="listbox"` on the dropdown
- `role="option"` on each result
- `aria-expanded` to indicate dropdown state
- `aria-autocomplete="list"` for autocomplete semantics
- `aria-label` on the input
- Keyboard navigation: ArrowUp, ArrowDown, Enter, Escape
- Clear button with `aria-label`

---

## 18. Mobile Responsive Strategy

| Breakpoint | Behavior |
|------------|----------|
| Desktop (lg+) | Inline search bar in navbar + search results page |
| Tablet (md) | Inline search bar with full dropdown |
| Mobile (<640px) | Search bar in navbar (compact); full-screen overlay for results page |

For mobile navbar search, replace the inline bar with a search icon that expands to full-width:

```js
// In Navbar.jsx — mobile search toggle
const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

{mobileSearchOpen && (
  <div className="lg:hidden absolute inset-0 bg-white z-50 flex items-center px-4">
    <SearchBar
      value=""
      onChange={(val) => {
        if (val.trim()) navigate(`/search?q=${encodeURIComponent(val.trim())}`);
        setMobileSearchOpen(false);
      }}
      autoFocus
      placeholder="Search..."
    />
    <button onClick={() => setMobileSearchOpen(false)} className="ml-2 text-gray-500">
      Cancel
    </button>
  </div>
)}
```

---

## 19. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No results for obvious match | Engine not initialized | Check `initSearchEngine()` is called |
| Empty dropdown | `_type` field missing | Add `_type` when adding documents |
| Typo "maraton" → no match | TF-IDF has no fuzzy matching | Add n-gram tokens or use Fuse.js fallback |
| Slow first search | IDF computation | Pre-warm with `initSearchEngine()` on app mount |
| Browser console: "Failed to load" | API endpoint unreachable | Check `VITE_PRIVATE_SERVER` in `.env` |
| Search dropdown behind other elements | z-index conflict | Set `z-50` on dropdown container |

---

## 20. Future Enhancements

| Enhancement | Effort | Benefit |
|-------------|--------|---------|
| N-gram tokenization | 2 files | Partial/fuzzy matching for typos |
| Web Worker offload | 1 file | Keeps main thread free for large corpuses |
| Search analytics | 3 files | Track popular queries, zero-result queries |
| Voice search | 2 files | Web Speech API integration |
| Server-side fallback | 2 files | Handle >10K documents |

---

## Appendix: Quick Reference

### File dependency graph
```
src/services/tfidf.js          ← core engine
src/services/searchEngine.js   ← init + searchAll (depends on tfidf + api)
src/hooks/useSearch.js         ← debounced hook (depends on searchEngine)
src/components/ui/SearchBar.jsx ← UI component (depends on hook + engine)
src/components/search/SearchResults.jsx ← full page (depends on hook + SearchBar)
src/components/ui/Navbar.jsx   ← global entry (depends on SearchBar)
src/components/event/EventList.jsx ← upgraded filter (depends on searchEngine)
```

### Key API surfaces
```
TFIDF.add(id, { fieldName: value, ... })
TFIDF.addAll(items, idField, ["field1", "field2", ...])
TFIDF.search(query, topN=20, minScore=0.01)
  → [{ id, score, fields: {...} }]
initSearchEngine()            → Promise<void>
searchAll(query, topN)        → array of results
getSearchStats()              → { documents, vocabulary, dirty }
```

---

## 21. Search Recommendation System — Overview

A **search recommendation system** enhances the search bar by suggesting queries and content **before** the user finishes typing. It combines:

| Layer | What it does | Data source |
|-------|-------------|-------------|
| **Query Autocomplete** | Suggest full queries from partial input | Corpus vocabulary + n-gram phrases |
| **Spell Correction** | "Did you mean X?" for typos | Levenshtein distance against vocabulary |
| **Related Searches** | Suggest alternative queries | TF-IDF similarity between document titles |
| **Trending Keywords** | Popular terms mined from corpus | Term frequency across all documents |
| **Content Recommendations** | Suggest items related to current search | TF-IDF vector similarity |

**Architecture:** All recommendation layers run client-side using the same TF-IDF index — no external API, no analytics history needed.

```
User types "mar"
  ↓
  1. Prefix autocomplete → ["marathon", "marathon da nang", "marathon training"]
  2. Spell correction    → (no correction needed, prefix matches)
  3. Trending keywords   → "Da Nang Marathon", "Trail Run", "5km Fun Run"
  ↓
Dropdown shows:
  ┌─────────────────────────────────────┐
  │ 🔍 Suggestions                      │
  │   marathon da nang  (search)        │
  │   marathon training tips  (search)  │
  │   marathon events 2026  (search)    │
  │                                     │
  │ 🔥 Trending                         │
  │   Da Nang International Marathon    │
  │   Son Tra Trail Challenge           │
  │   Half Marathon Training            │
  └─────────────────────────────────────┘
```

---

## 22. Query Autocomplete Engine

Create `src/services/recommendations.js`:

```js
import { getSearchEngine } from "./tfidf";

/**
 * Search Recommendation System
 * Corpus-based autocomplete, spell correction, related queries.
 * Zero dependencies — runs on the same TF-IDF index.
 */

class SearchRecommender {
  constructor() {
    this.vocabList = [];
    this.ngramIndex = [];
    this.titleCorpus = [];
    this.trendingCache = [];
    this.built = false;
  }

  /** Build recommendation indices from the TF-IDF engine */
  build() {
    const engine = getSearchEngine();
    if (engine.docCount === 0) return;

    // Extract sorted vocabulary for prefix matching
    this.vocabList = Array.from(engine.vocabulary).sort();

    // Extract document titles/names for n-gram phrases
    this.titleCorpus = engine.documents
      .map((d) => d.fields.name ?? d.fields.title ?? "")
      .filter(Boolean);

    // Build n-gram phrase index (bigrams + trigrams from titles)
    const phraseSet = new Set();
    for (const title of this.titleCorpus) {
      const tokens = engine.tokenize(title);
      for (let i = 0; i < tokens.length; i++) {
        // Bigrams
        if (i + 1 < tokens.length) {
          phraseSet.add(`${tokens[i]} ${tokens[i + 1]}`);
        }
        // Trigrams
        if (i + 2 < tokens.length) {
          phraseSet.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
        }
      }
      // Also add the full title if short enough
      if (tokens.length >= 2 && tokens.length <= 6) {
        phraseSet.add(tokens.join(" "));
      }
    }
    this.ngramIndex = Array.from(phraseSet).sort();

    // Precompute trending keywords (high-TF terms from document corpus)
    const termFreq = {};
    for (const title of this.titleCorpus) {
      const tokens = engine.tokenize(title);
      const seen = new Set();
      for (const t of tokens) {
        if (!seen.has(t)) {
          termFreq[t] = (termFreq[t] ?? 0) + 1;
          seen.add(t);
        }
      }
    }
    this.trendingCache = Object.entries(termFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([term]) => term);

    this.built = true;
  }

  /** Rebuild if index has changed */
  ensureBuilt() {
    const engine = getSearchEngine();
    if (!this.built || engine.dirty) {
      this.build();
    }
  }

  /**
   * Prefix autocomplete — find vocabulary + phrases starting with prefix
   * Returns suggestions with type: "term" | "phrase"
   */
  autocomplete(prefix, topN = 6) {
    this.ensureBuilt();
    if (!prefix?.trim() || prefix.trim().length < 1) return [];

    const q = prefix.toLowerCase().trim();
    const results = [];

    // 1. Single-word completions from vocabulary
    for (const word of this.vocabList) {
      if (results.length >= topN) break;
      if (word.startsWith(q) && word !== q) {
        results.push({ text: word, type: "term" });
      }
    }

    // 2. Phrase completions from n-gram index
    for (const phrase of this.ngramIndex) {
      if (results.length >= topN * 2) break;
      if (phrase.startsWith(q) && phrase !== q && !results.some((r) => r.text === phrase)) {
        results.push({ text: phrase, type: "phrase" });
      }
    }

    return results.slice(0, topN);
  }

  /**
   * Spell correction — "Did you mean?"
   * Uses Levenshtein distance against vocabulary.
   * Only triggers when no direct prefix match exists.
   */
  spellCorrection(query, maxDistance = 2, topN = 3) {
    this.ensureBuilt();
    if (!query?.trim() || query.trim().length < 3) return [];

    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/);

    // Only suggest if no exact vocabulary match for the full query
    const engine = getSearchEngine();
    const qTokens = engine.tokenize(q);
    if (qTokens.length === 0) return [];

    const corrections = [];

    for (const token of qTokens) {
      for (const word of this.vocabList) {
        const dist = this.levenshtein(token, word);
        if (dist > 0 && dist <= maxDistance) {
          const corrected = q.replace(token, word);
          if (corrected !== q && !corrections.some((c) => c.text === corrected)) {
            corrections.push({ text: corrected, distance: dist, original: token, suggestion: word });
          }
        }
      }
    }

    return corrections
      .sort((a, b) => a.distance - b.distance)
      .slice(0, topN);
  }

  /**
   * Related queries — find semantically similar phrases
   * Uses TF-IDF cosine similarity between query and document titles.
   */
  relatedQueries(query, topN = 5) {
    this.ensureBuilt();
    if (!query?.trim() || this.titleCorpus.length === 0) return [];

    const engine = getSearchEngine();
    const { vector: qVec, tokens } = engine.queryVector(query);
    if (tokens.length === 0) return [];

    // Score each title as a query suggestion
    const scores = [];
    for (const title of this.titleCorpus) {
      if (title.toLowerCase() === query.toLowerCase().trim()) continue;
      const titleTokens = engine.tokenize(title);
      if (titleTokens.length === 0) continue;

      // Build mini-doc just for this title
      const freq = {};
      for (const t of titleTokens) freq[t] = (freq[t] ?? 0) + 1;
      const titleDoc = { tokens: freq, length: titleTokens.length };
      const titleVec = engine.vector(titleDoc);

      const sim = engine.cosineSimilarity(qVec, titleVec);
      if (sim > 0.05) {
        scores.push({ text: title, score: sim });
      }
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }

  /**
   * Trending keywords — most frequent meaningful terms in corpus
   */
  trending(topN = 8) {
    this.ensureBuilt();
    return this.trendingCache.slice(0, topN);
  }

  /** Levenshtein edit distance */
  levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  /**
   * Full recommendation pipeline — returns everything for the dropdown
   */
  recommend(query, options = {}) {
    const {
      autoCompleteTopN = 5,
      spellTopN = 2,
      relatedTopN = 3,
      trendingTopN = 5,
    } = options;

    if (!query?.trim() || query.trim().length < 1) {
      return { suggestions: [], corrections: [], related: [], trending: this.trending(trendingTopN) };
    }

    const trimmed = query.trim();

    // Phase 1: Always try autocomplete
    const suggestions = this.autocomplete(trimmed, autoCompleteTopN);

    // Phase 2: Spell correction only if few/no completions and enough chars
    let corrections = [];
    if (suggestions.length < 2 && trimmed.length >= 3) {
      corrections = this.spellCorrection(trimmed, 2, spellTopN);
    }

    // Phase 3: Related queries (semantic similarity)
    const related = this.relatedQueries(trimmed, relatedTopN);

    // Phase 4: Trending (always included for discovery)
    const trending = this.trending(trendingTopN);

    return { suggestions, corrections, related, trending };
  }
}

let instance = null;
export function getRecommender() {
  if (!instance) instance = new SearchRecommender();
  return instance;
}

export default SearchRecommender;
```

---

## 23. Integrating Recommendations into SearchBar

Update `src/components/ui/SearchBar.jsx` to show recommendation sections in the dropdown:

```js
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchAll, initSearchEngine } from "../../services/searchEngine";
import { useSearch } from "../../hooks/useSearch";
import { getRecommender } from "../../services/recommendations";

const SearchBar = ({ value, onChange, placeholder, classNameStyle, autoFocus, onSelect }) => {
  const [query, setQuery] = useState(value ?? "");
  const [showResults, setShowResults] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [recommendations, setRecommendations] = useState({
    suggestions: [], corrections: [], related: [], trending: [],
  });
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const selectedIndexRef = useRef(-1);
  const totalItemsRef = useRef(0);

  useEffect(() => {
    initSearchEngine()
      .then(() => {
        setEngineReady(true);
        // Build recommender once engine is ready
        getRecommender().build();
      })
      .catch(() => {});
  }, []);

  const { results, loading } = useSearch(searchAll, query, {
    debounceMs: 300,
    topN: 8,
  });

  // Update recommendations on query change
  useEffect(() => {
    if (!engineReady) return;
    const timer = setTimeout(() => {
      const recs = getRecommender().recommend(query, {
        autoCompleteTopN: 5,
        spellTopN: 2,
        relatedTopN: 3,
        trendingTopN: 4,
      });
      setRecommendations(recs);
    }, 150); // Slightly faster than search for instant feel
    return () => clearTimeout(timer);
  }, [query, engineReady]);

  // Count total interactive items for keyboard nav
  const suggestionCount = recommendations.suggestions.length;
  const correctionCount = recommendations.corrections.length;
  const relatedCount = recommendations.related.length;
  const trendingCount = (!query.trim() && !loading && results.length === 0)
    ? recommendations.trending.length : 0;
  const resultCount = showResults ? results.length : 0;
  totalItemsRef.current = suggestionCount + correctionCount + relatedCount + trendingCount + resultCount;

  const handleChange = useCallback((val) => {
    setQuery(val);
    onChange?.(val);
    setShowResults(val.trim().length > 0);
    selectedIndexRef.current = -1;
  }, [onChange]);

  const handleSelect = useCallback((result) => {
    setShowResults(false);
    setQuery(result.fields.name ?? result.fields.title ?? "");
    onSelect?.(result);
    if (result.fields._type === "event") navigate(`/Event`);
    else if (result.fields._type === "article") navigate(`/News`);
  }, [navigate, onSelect]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion.text);
    setShowResults(true);
    // Trigger search by setting query in onChange-style
    onChange?.(suggestion.text);
  }, [onChange]);

  const handleTrendingClick = useCallback((term) => {
    setQuery(term);
    setShowResults(true);
    onChange?.(term);
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    const total = totalItemsRef.current;
    if (total === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, total - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = selectedIndexRef.current;
      if (idx < 0) return;

      // Map flat index back to the correct action
      let cursor = 0;
      // Suggestions section
      if (idx < cursor + suggestionCount) {
        handleSuggestionClick(recommendations.suggestions[idx - cursor]);
        return;
      }
      cursor += suggestionCount;
      // Corrections section
      if (idx < cursor + correctionCount) {
        handleSuggestionClick(recommendations.corrections[idx - cursor]);
        return;
      }
      cursor += correctionCount;
      // Trending section (shown when no query)
      if (idx < cursor + trendingCount) {
        handleTrendingClick(recommendations.trending[idx - cursor]);
        return;
      }
      cursor += trendingCount;
      // Related searches
      if (idx < cursor + relatedCount) {
        handleSuggestionClick(recommendations.related[idx - cursor]);
        return;
      }
      cursor += relatedCount;
      // Search results
      if (idx < cursor + resultCount) {
        handleSelect(results[idx - cursor]);
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
      inputRef.current?.blur();
    }
  }, [
    suggestionCount, correctionCount, trendingCount, relatedCount, resultCount,
    recommendations, results, handleSuggestionClick, handleTrendingClick, handleSelect,
  ]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Compute flat index offset for highlight rendering
  const isHighlighted = (baseIndex) => selectedIndexRef.current === baseIndex;

  let flatIndex = 0;

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() || recommendations.trending.length > 0) setShowResults(true);
          }}
          placeholder={placeholder || "Search events, articles, tips..."}
          autoFocus={autoFocus}
          className={`w-full rounded-lg border py-2 pl-8 pr-3 text-sm focus:outline-none ${
            classNameStyle ?? "border-gray-300 focus:border-[#55b576] focus:ring-2 focus:ring-[#55b576]/20"
          }`}
          aria-label="Search"
          aria-expanded={showResults}
          aria-autocomplete="list"
          role="combobox"
        />
        {loading && (
          <span className="absolute right-3 text-gray-400">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        {!loading && query && (
          <button
            onClick={() => { setQuery(""); onChange?.(""); setShowResults(false); }}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 search-dropdown-scroll"
          role="listbox"
        >
          {!engineReady && (
            <div className="p-3 text-sm text-gray-400 text-center">Initializing search...</div>
          )}

          {engineReady && !query.trim() && trendingCount > 0 && (
            <div>
              <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <span>🔥</span> Trending
              </div>
              {recommendations.trending.map((term, i) => {
                const idx = flatIndex++;
                return (
                  <div
                    key={`trend-${term}`}
                    role="option"
                    aria-selected={idx === selectedIndexRef.current}
                    className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                      idx === selectedIndexRef.current ? "bg-[#55b576]/10" : "hover:bg-gray-50"
                    }`}
                    onMouseDown={() => handleTrendingClick(term)}
                    onMouseEnter={() => { selectedIndexRef.current = idx; }}
                  >
                    <span className="text-gray-300 text-xs">{i + 1}</span>
                    <span className="text-gray-700">{term}</span>
                    <span className="ml-auto text-[10px] text-gray-400">search</span>
                  </div>
                );
              })}
              <div className="border-t border-gray-100 my-1" />
            </div>
          )}

          {engineReady && query.trim() && (
            <>
              {/* Query Suggestions (autocomplete) */}
              {suggestionCount > 0 && (
                <div>
                  <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Suggestions
                  </div>
                  {recommendations.suggestions.map((s) => {
                    const idx = flatIndex++;
                    return (
                      <div
                        key={`sug-${s.text}`}
                        role="option"
                        aria-selected={idx === selectedIndexRef.current}
                        className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                          idx === selectedIndexRef.current ? "bg-[#55b576]/10" : "hover:bg-gray-50"
                        }`}
                        onMouseDown={() => handleSuggestionClick(s)}
                        onMouseEnter={() => { selectedIndexRef.current = idx; }}
                      >
                        <span className="text-gray-400 text-xs">
                          {s.type === "phrase" ? "🔤" : "💬"}
                        </span>
                        <span className="text-gray-700">{s.text}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-gray-100 my-1" />
                </div>
              )}

              {/* Spell Corrections */}
              {correctionCount > 0 && (
                <div>
                  <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-500">
                    Did you mean?
                  </div>
                  {recommendations.corrections.map((c) => {
                    const idx = flatIndex++;
                    return (
                      <div
                        key={`cor-${c.text}`}
                        role="option"
                        aria-selected={idx === selectedIndexRef.current}
                        className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                          idx === selectedIndexRef.current ? "bg-[#55b576]/10" : "hover:bg-gray-50"
                        }`}
                        onMouseDown={() => handleSuggestionClick(c)}
                        onMouseEnter={() => { selectedIndexRef.current = idx; }}
                      >
                        <span className="text-amber-400 text-xs">✏️</span>
                        <span className="text-gray-700">{c.text}</span>
                        <span className="ml-auto text-[10px] text-gray-400">
                          instead of "{c.original}"
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t border-gray-100 my-1" />
                </div>
              )}
            </>
          )}

          {/* Related Searches */}
          {query.trim() && relatedCount > 0 && (
            <div>
              <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Related
              </div>
              {recommendations.related.map((r) => {
                const idx = flatIndex++;
                return (
                  <div
                    key={`rel-${r.text}`}
                    role="option"
                    aria-selected={idx === selectedIndexRef.current}
                    className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                      idx === selectedIndexRef.current ? "bg-[#55b576]/10" : "hover:bg-gray-50"
                    }`}
                    onMouseDown={() => handleSuggestionClick(r)}
                    onMouseEnter={() => { selectedIndexRef.current = idx; }}
                  >
                    <span className="text-gray-400 text-xs">🔗</span>
                    <span className="text-gray-700">{r.text}</span>
                  </div>
                );
              })}
              <div className="border-t border-gray-100 my-1" />
            </div>
          )}

          {/* Search Results */}
          <div>
            {results.length === 0 && !loading && query.trim() && suggestionCount === 0 && correctionCount === 0 && relatedCount === 0 ? (
              <div className="p-3 text-sm text-gray-400 text-center">No results found</div>
            ) : (
              results.length > 0 && (
                <div>
                  <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Results
                  </div>
                  {results.map((r, i) => {
                    const idx = flatIndex++;
                    return (
                      <div
                        key={r.id}
                        role="option"
                        aria-selected={idx === selectedIndexRef.current}
                        className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                          idx === selectedIndexRef.current ? "bg-[#55b576]/10" : "hover:bg-gray-50"
                        }`}
                        onMouseDown={() => handleSelect(r)}
                        onMouseEnter={() => { selectedIndexRef.current = idx; }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {r.fields.name ?? r.fields.title ?? `Item #${r.id}`}
                          </div>
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0 ml-2"
                            style={{
                              backgroundColor:
                                r.fields._type === "event" ? "#dcfce7" :
                                r.fields._type === "article" ? "#dbeafe" : "#fef3c7",
                              color:
                                r.fields._type === "event" ? "#166534" :
                                r.fields._type === "article" ? "#1e40af" : "#92400e",
                            }}
                          >
                            {r.fields._type ?? "item"}
                          </span>
                        </div>
                        {r.fields.location && (
                          <div className="text-xs text-gray-400 mt-0.5">{r.fields.location}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
```

---

## 24. Recommendation System Demo / Debug Page

Create `src/components/search/RecommendationDebug.jsx` (dev-only, not in production nav):

```js
import { useState, useEffect } from "react";
import { initSearchEngine } from "../../services/searchEngine";
import { getRecommender } from "../../services/recommendations";

export default function RecommendationDebug() {
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState(null);
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    initSearchEngine()
      .then(() => {
        getRecommender().build();
        setReady(true);
        const engine = (await import("../../services/tfidf")).getSearchEngine();
        setStats(engine.stats());
      })
      .catch(() => {});
  }, []);

  const handleTest = () => {
    if (!query.trim()) return;
    const recommender = getRecommender();
    setRecs({
      autocomplete: recommender.autocomplete(query, 10),
      spellCorrection: recommender.spellCorrection(query),
      relatedQueries: recommender.relatedQueries(query),
      trending: recommender.trending(10),
    });
  };

  const commonQueries = [
    "marathon", "da nang", "trail", "training", "5km",
    "half marathon", "running", "sontra", "hue", "5k",
  ];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Search Recommendation Debug</h1>

      {!ready && <p className="text-gray-400">Loading engine...</p>}

      {stats && (
        <div className="text-sm text-gray-500 mb-4">
          Documents: {stats.documents} · Vocabulary: {stats.vocabulary} terms
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a query to test..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleTest()}
        />
        <button onClick={handleTest} className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
          Test
        </button>
      </div>

      {/* Quick test buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {commonQueries.map((q) => (
          <button
            key={q}
            onClick={() => { setQuery(q); setTimeout(() => handleTest(), 50); }}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            {q}
          </button>
        ))}
      </div>

      {recs && (
        <div className="space-y-6">
          {/* Autocomplete */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Autocomplete ({recs.autocomplete.length})
            </h2>
            <div className="space-y-1">
              {recs.autocomplete.length === 0 && <p className="text-xs text-gray-400">None</p>}
              {recs.autocomplete.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-white border rounded px-3 py-1.5">
                  <span className="text-xs text-gray-400">{s.type === "phrase" ? "🔤" : "💬"}</span>
                  <span>{s.text}</span>
                  <span className="ml-auto text-[10px] text-gray-400">{s.type}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Spell Correction */}
          <section>
            <h2 className="text-sm font-semibold text-amber-500 uppercase mb-2">
              Spell Correction ({recs.spellCorrection.length})
            </h2>
            <div className="space-y-1">
              {recs.spellCorrection.length === 0 && <p className="text-xs text-gray-400">None</p>}
              {recs.spellCorrection.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-amber-50 border border-amber-200 rounded px-3 py-1.5">
                  <span>✏️</span>
                  <span className="font-medium">{c.text}</span>
                  <span className="text-xs text-gray-400">
                    (dist: {c.distance}, "{c.original}" → "{c.suggestion}")
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Related Queries ({recs.relatedQueries.length})
            </h2>
            <div className="space-y-1">
              {recs.relatedQueries.length === 0 && <p className="text-xs text-gray-400">None</p>}
              {recs.relatedQueries.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-white border rounded px-3 py-1.5">
                  <span>🔗</span>
                  <span>{r.text}</span>
                  <span className="ml-auto text-xs text-gray-400">{(r.score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Trending */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Trending Keywords ({recs.trending.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {recs.trending.map((t, i) => (
                <span key={i} className="text-xs bg-gray-100 border rounded-full px-2.5 py-1">{t}</span>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
```

---

## 25. Recommendation System — Complete File Checklist

| # | Action | File | Status |
|---|--------|------|--------|
| 1 | Create recommendation engine | `src/services/recommendations.js` | New |
| 2 | Update SearchBar with recommendation sections | `src/components/ui/SearchBar.jsx` | Edit |
| 3 | Create debug/dev page | `src/components/search/RecommendationDebug.jsx` | New (optional) |

---

## 26. Recommendation System — Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    TF-IDF Index                          │
│  (events, articles, posts → tokenized → vectorized)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SearchRecommender                           │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ N-gram Index │  │   Vocab     │  │  Trending    │  │
│  │ (phrases)    │  │   List      │  │  Cache       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │          │
│         ▼                 ▼                 ▼          │
│  autocomplete()    spellCorrection()    trending()      │
│  relatedQueries()                                      │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              SearchBar Dropdown                          │
│                                                         │
│  ┌─ Suggestions ─────────────────────────────────────┐  │
│  │  marathon da nang                          🔤     │  │
│  │  marathon training tips                    💬     │  │
│  ├─ Did you mean? ────────────────────────────┘      │  │
│  │  ✏️ maraton → marathon                             │  │
│  ├─ Related ───────────────────────────────────┐     │  │
│  │  🔗 Da Nang International Marathon          │     │  │
│  │  🔗 Half Marathon Training                  │     │  │
│  ├─ Results ───────────────────────────────────┘     │  │
│  │  [event] Da Nang Marathon                   96%   │  │
│  │  [post]  Marathon Training Tips             72%   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 27. Recommendation System — Performance

| Component | Complexity | Real-world (200 docs, 500 vocab) |
|-----------|------------|----------------------------------|
| `build()` | O(D × T²) where T = avg title tokens | ~2-5ms on build |
| `autocomplete()` | O(V + P) where V = vocab, P = phrases | <1ms |
| `spellCorrection()` | O(T × V) where T = query tokens | ~2-8ms |
| `relatedQueries()` | O(D × V) — cosine sim against all titles | ~3-10ms |
| `trending()` | O(1) — precomputed | <0.1ms |
| Full `recommend()` pipeline | Sum of above | ~5-20ms |

**Memory overhead:** ~10-50KB for n-gram + vocabulary indices (negligible).

---

## 28. Recommendation System — Edge Cases

| Scenario | Behavior |
|----------|----------|
| Empty corpus (no data loaded) | `build()` returns silently; all methods return `[]` |
| Single-character query | Autocomplete still works; spell correction skipped (< 3 chars) |
| Stopword-only query | `tokenize()` returns empty; no recommendations |
| Query matches everything | Related queries returns diverse suggestions; trending remains |
| Query matches nothing | Autocomplete + spell correction try to help; trending shown |
| Rapid typing | 150ms debounce on recommendations (faster than search debounce) |
| Special characters | Tokenizer strips them; recommendations operate on clean tokens |

---

## 29. Testing — Recommendation System

```js
// src/services/__tests__/recommendations.test.js
import TFIDF, { getSearchEngine } from "../tfidf";
import SearchRecommender, { getRecommender } from "../recommendations";

describe("SearchRecommender", () => {
  beforeEach(() => {
    // Reset engine
    const engine = getSearchEngine();
    engine.clear();
  });

  it("builds indices from engine documents", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Da Nang Marathon", location: "Da Nang" });
    engine.add("2", { name: "Trail Run Son Tra", location: "Son Tra" });
    engine.add("3", { name: "Half Marathon Training", location: "Da Nang" });

    const rec = new SearchRecommender();
    rec.build();
    expect(rec.vocabList.length).toBeGreaterThan(0);
    expect(rec.ngramIndex.length).toBeGreaterThan(0);
    expect(rec.trendingCache.length).toBeGreaterThan(0);
  });

  it("autocompletes prefix to vocabulary terms", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Da Nang Marathon" });
    engine.add("2", { name: "Marathon Training" });

    const rec = new SearchRecommender();
    rec.build();
    const results = rec.autocomplete("mar", 5);
    expect(results.some((r) => r.text === "marathon")).toBe(true);
  });

  it("autocompletes prefix to phrases", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Da Nang International Marathon" });

    const rec = new SearchRecommender();
    rec.build();
    const results = rec.autocomplete("da", 10);
    expect(results.some((r) => r.text === "da nang international marathon")).toBe(true);
  });

  it("spellCorrection catches typos", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Marathon Event Da Nang" });

    const rec = new SearchRecommender();
    rec.build();
    const corrections = rec.spellCorrection("maraton", 2);
    expect(corrections.some((c) => c.text.includes("marathon"))).toBe(true);
  });

  it("spellCorrection returns empty for exact matches", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Marathon" });

    const rec = new SearchRecommender();
    rec.build();
    expect(rec.spellCorrection("marathon")).toEqual([]);
  });

  it("relatedQueries finds semantically similar titles", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Da Nang Marathon" });
    engine.add("2", { name: "Da Nang Half Marathon" });
    engine.add("3", { name: "Trail Running Tips" });

    const rec = new SearchRecommender();
    rec.build();
    const related = rec.relatedQueries("marathon", 5);
    expect(related.some((r) => r.text.includes("Half"))).toBe(true);
  });

  it("trending returns high-frequency terms", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Da Nang Marathon Da Nang" });
    engine.add("2", { name: "Da Nang Trail Run" });

    const rec = new SearchRecommender();
    rec.build();
    const trending = rec.trending(5);
    expect(trending[0]).toBe("da");  // most frequent
  });

  it("recommend pipeline returns all sections", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Da Nang International Marathon" });
    engine.add("2", { name: "Half Marathon Training" });
    engine.add("3", { name: "Trail Run Son Tra" });

    const rec = new SearchRecommender();
    rec.build();
    const result = rec.recommend("mar", {
      autoCompleteTopN: 3, spellTopN: 2, relatedTopN: 3, trendingTopN: 3,
    });
    expect(result).toHaveProperty("suggestions");
    expect(result).toHaveProperty("corrections");
    expect(result).toHaveProperty("related");
    expect(result).toHaveProperty("trending");
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("handles empty query gracefully", () => {
    const engine = getSearchEngine();
    engine.add("1", { name: "Marathon" });

    const rec = new SearchRecommender();
    rec.build();
    const result = rec.recommend("");
    expect(result.suggestions).toEqual([]);
    expect(result.corrections).toEqual([]);
    expect(result.related).toEqual([]);
    expect(result.trending.length).toBeGreaterThan(0);
  });
});
```

---

## 30. Customizing Recommendation Behavior

Tune the recommender via options passed to `recommend()`:

```js
getRecommender().recommend(query, {
  autoCompleteTopN: 8,   // More suggestions
  spellTopN: 3,          // More corrections
  relatedTopN: 5,        // More related queries
  trendingTopN: 8,       // More trending terms
});
```

For the SearchBar, adjust timing:

```js
// In SearchBar.jsx — recommendation debounce
const timer = setTimeout(() => {
  const recs = getRecommender().recommend(query, {
    autoCompleteTopN: 5,
    spellTopN: 2,
    relatedTopN: 3,
    trendingTopN: 4,
  });
  setRecommendations(recs);
}, query.trim().length < 3 ? 200 : 100); // Faster for longer queries
```

---

## 31. Adding Trending to Search Results Page

In `src/components/search/SearchResults.jsx`, add a trending section when the page loads without a query:

```js
// Inside SearchResults component
const [trending, setTrending] = useState([]);
const [showTrending, setShowTrending] = useState(true);

useEffect(() => {
  if (engineReady) {
    const recs = getRecommender();
    setTrending(recs.trending(10));
  }
}, [engineReady]);

// In the empty state section (when !query.trim()):
{showTrending && trending.length > 0 && (
  <div className="mt-8">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
      🔥 Trending Searches
    </h2>
    <div className="flex flex-wrap gap-2">
      {trending.map((term) => (
        <button
          key={term}
          onClick={() => handleSearch(term)}
          className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#55b576] hover:text-[#55b576] transition-colors"
        >
          {term}
        </button>
      ))}
    </div>
  </div>
)}
```

---

## 32. Recommendation System — Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No suggestions shown | Recommender not built | Call `getRecommender().build()` after `initSearchEngine()` |
| Empty autocomplete for partial word | Vocab list empty / not populated | Check engine has documents added |
| Spell correction not triggering | Edit distance threshold too low (default 2) | Increase `maxDistance` param |
| Related queries always empty | Cosine similarity threshold too high | Lower `minScore` in `relatedQueries()` |
| Trending shows irrelevant terms | Small corpus skews frequency | Increase corpus size or add stopwords |
| `build()` called before engine ready | Race condition | Chain via `initSearchEngine().then(() => recommender.build())` |
| Keyboard nav skips sections | `flatIndex` not matching section order | Check index cursor math in `handleKeyDown` |

---

*Generated from project scan at BestWebDesign. Last updated: 2026-06-23.*
