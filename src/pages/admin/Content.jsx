import { useState, useEffect } from "react";
import { getAdminArticles, triggerCrawl } from "../../services/adminApi";
import { RefreshCw, FileText } from "lucide-react";

export default function AdminContent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [crawling, setCrawling] = useState(null);

  useEffect(() => {
    getAdminArticles()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCrawl = async (type) => {
    setCrawling(type);
    setError("");
    try {
      await triggerCrawl(type);
      if (type === "articles") {
        const data = await getAdminArticles();
        setArticles(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCrawling(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="flex gap-4 mb-6">
        <button
          className={`btn btn-outline ${crawling === "articles" ? "loading" : ""}`}
          onClick={() => handleCrawl("articles")}
          disabled={crawling !== null}
        >
          <RefreshCw size={16} />
          Re-crawl Articles
        </button>
        <button
          className={`btn btn-outline ${crawling === "posts" ? "loading" : ""}`}
          onClick={() => handleCrawl("posts")}
          disabled={crawling !== null}
        >
          <RefreshCw size={16} />
          Re-crawl Posts
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-2">
            <FileText size={40} />
            <p>No articles found. Try re-crawling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="font-medium max-w-md truncate">
                      {article.title || "Untitled"}
                    </td>
                    <td className="text-sm text-gray-500">
                      {article.date || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
