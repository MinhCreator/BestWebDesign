import { useState, useEffect } from "react";
import { getRegistrations, deleteRegistration } from "../../services/adminApi";
import { Trash2, Search } from "lucide-react";
import { NationMetadata } from "../../shared/nationalMetadata";

const Nationalities = NationMetadata.NationInfor;

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = () => {
    setLoading(true);
    getRegistrations()
      .then(setRegistrations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (index) => {
    if (!confirm("Delete this registration?")) return;
    try {
      await deleteRegistration(index);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = registrations.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) || r.event?.includes(search) ||
      r.nationality?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Registrations</h1>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-gray-500">
            {filtered.length} result(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Event</th>
                <th>Nation</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No registrations found
                  </td>
                </tr>
              ) : (
                filtered.map((reg, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="font-medium">{reg.name}</td>
                    <td>{reg.phone}</td>
                    <td className="font-medium">{reg.event}</td>
                    <td>
                      {reg.nationality ? (
                        <div className="flex items-center gap-2">
                          {(() => {
                            const nat = Nationalities.find((n) => n.name === reg.nationality);
                            return nat?.image_url ? (
                              <img src={nat.image_url} alt="" className="w-6 h-4 rounded object-cover" />
                            ) : null;
                          })()}
                          {reg.nationality}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="text-sm text-gray-500">
                      {reg.timestamp
                        ? new Date(reg.timestamp).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm text-red-500 cursor-pointer"
                        onClick={() => handleDelete(registrations.indexOf(reg))}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
