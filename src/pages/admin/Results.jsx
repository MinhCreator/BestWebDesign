import { useState, useEffect } from "react";
import { getAdminEvents } from "../../services/adminApi";
import {
  getAdminResults,
  createResult,
  updateResult,
  deleteResult,
} from "../../services/adminApi";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = {
  event_id: "",
  runner_name: "",
  nationality: "",
  time: "",
  avatar: "",
};

export default function AdminResults() {
  const [events, setEvents] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message));
  }, []);

  const fetchResults = async (eventId) => {
    if (!eventId) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getAdminResults(eventId);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(selectedEventId);
  }, [selectedEventId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, event_id: Number(selectedEventId) });
    setShowForm(true);
  };

  const openEdit = (result) => {
    setEditingId(result.id);
    setForm({
      event_id: result.event_id,
      runner_name: result.runner_name || "",
      nationality: result.nationality || "",
      time: result.time || "",
      avatar: result.avatar || "",
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, event_id: Number(form.event_id) };
      if (editingId) {
        await updateResult(editingId, payload);
      } else {
        await createResult(payload);
      }
      setShowForm(false);
      fetchResults(selectedEventId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (!confirm("Delete this result?")) return;
    try {
      await deleteResult(resultId);
      fetchResults(selectedEventId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Results Management</h1>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* Event selector */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="form-control flex-1 min-w-[200px]">
            <label className="label">
              <span className="label-text">Select Event *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">-- Choose an event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.date})
                </option>
              ))}
            </select>
          </div>

          {selectedEventId && (
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <Plus size={16} />
              Add Result
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Result" : "New Result"}
          </h2>
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Runner Name *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.runner_name}
                onChange={(e) =>
                  setForm({ ...form, runner_name: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nationality *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.nationality}
                onChange={(e) =>
                  setForm({ ...form, nationality: e.target.value })
                }
                placeholder="e.g. Vietnam"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Time *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="e.g. 01:49:32"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Avatar URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="/Avatar/1.svg"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex gap-2 pt-4">
              <button
                type="submit"
                className={`btn btn-primary ${saving ? "loading" : ""}`}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Result"
                    : "Create Result"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Runner Name</th>
                <th>Nationality</th>
                <th>Time</th>
                <th>Avatar</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!selectedEventId ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Select an event to view results
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <span className="loading loading-spinner loading-md" />
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No results found for this event
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td className="font-medium">{r.runner_name}</td>
                    <td>{r.nationality}</td>
                    <td className="font-mono">{r.time}</td>
                    <td className="text-sm text-gray-500 max-w-[120px] truncate">
                      {r.avatar || "—"}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-xs cursor-pointer"
                          onClick={() => openEdit(r)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-red-500 cursor-pointer"
                          onClick={() => handleDelete(r.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
