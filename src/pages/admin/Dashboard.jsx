import { useState, useEffect } from "react";
import { getDashboard } from "../../services/adminApi";
import { FileText, Users, Database, Activity, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  const cards = [
    {
      label: "Articles",
      value: stats.articles,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "Posts",
      value: stats.posts,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      label: "Events",
      value: stats.events,
      icon: Calendar,
      color: "bg-amber-500",
    },
    {
      label: "Registrations",
      value: stats.registrations,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Admin Users",
      value: stats.admin_users,
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="stat bg-white rounded-xl shadow-sm border"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}
              >
                <card.icon className="text-white" size={24} />
              </div>
              <div>
                <div className="stat-title text-gray-500 text-sm">
                  {card.label}
                </div>
                <div className="stat-value text-2xl font-bold">
                  {card.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database size={20} />
          Cache Status
        </h2>
        <div className="space-y-2">
          {Object.entries(stats.cache || {}).map(([key, cached]) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
              <span
                className={`badge ${cached ? "badge-success" : "badge-ghost"}`}
              >
                {cached ? "Cached" : "Empty"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
