import { useState, useEffect } from "react";
import { getAdminHealth, clearCache } from "../../services/adminApi";
import { RefreshCw, Trash2, Activity } from "lucide-react";

export default function AdminSystemHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchHealth = () => {
    setLoading(true);
    getAdminHealth()
      .then(setHealth)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleClearCache = async () => {
    if (!confirm("Clear all cache?")) return;
    setClearing(true);
    setMessage("");
    try {
      await clearCache();
      setMessage("Cache cleared successfully");
      fetchHealth();
    } catch (err) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  };

  const statusBadge = (status) => {
    if (status === "ok") return <span className="badge badge-success">OK</span>;
    if (status?.startsWith("offline"))
      return <span className="badge badge-error">Offline</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Health</h1>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {message && <div className="alert alert-success mb-4">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} />
            API Endpoints
          </h2>
          <div className="space-y-3">
            {health &&
              Object.entries(health)
                .filter(([k]) => k !== "cache")
                .map(([key, status]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="capitalize font-medium">/api/{key}</span>
                    {statusBadge(status)}
                  </div>
                ))}
          </div>
        </div>

        {/* Cache Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Trash2 size={20} />
              Cache
            </h2>
            <button
              className={`btn btn-outline btn-sm ${clearing ? "loading" : ""}`}
              onClick={handleClearCache}
              disabled={clearing}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
          <div className="space-y-3">
            {health?.cache &&
              Object.entries(health.cache).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <span
                    className={`badge ${value ? "badge-success" : "badge-ghost"}`}
                  >
                    {typeof value === "boolean"
                      ? value
                        ? "Cached"
                        : "Empty"
                      : value}
                  </span>
                </div>
              ))}
          </div>
          <div className="mt-4">
            <button className="btn btn-ghost btn-sm" onClick={fetchHealth}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
