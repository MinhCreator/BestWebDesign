import { useState, useEffect, useCallback } from "react";
import { getAdminEvents } from "../../services/adminApi";
import {
  getAdminResults,
  createResult,
  updateResult,
  deleteResult,
} from "../../services/adminApi";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { NationMetadata } from "../../shared/nationalMetadata"

const NATIONALITIES = NationMetadata.NationInfor; 

const TIME_REGEX = /^(\d{1,2}):(\d{2})(:(\d{2}))?$/;

function formatTimeInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`;
}

function validateTime(value) {
  if (!value) return "Time is required";
  if (!TIME_REGEX.test(value)) return "Invalid format. Use MM:SS or HH:MM:SS";
  const parts = value.split(":");
  if (parts.length === 2) {
    const m = parseInt(parts[0]);
    const s = parseInt(parts[1]);
    if (s >= 60) return "Seconds must be 0-59";
  }
  if (parts.length === 3) {
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const s = parseInt(parts[2]);
    if (m >= 60) return "Minutes must be 0-59";
    if (s >= 60) return "Seconds must be 0-59";
  }
  return "";
}

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
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message));
  }, []);

  const fetchResults = useCallback(async (eventId) => {
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
  }, []);

  useEffect(() => {
    fetchResults(selectedEventId);
  }, [selectedEventId, fetchResults]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, event_id: Number(selectedEventId) });
    setFormErrors({});
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
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.runner_name.trim()) errors.runner_name = "Runner name is required";
    if (!form.nationality) errors.nationality = "Nationality is required";
    const timeErr = validateTime(form.time);
    if (timeErr) errors.time = timeErr;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResult(deleteTarget.id);
      setDeleteTarget(null);
      fetchResults(selectedEventId);
    } catch (err) {
      setError(err.message);
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const reordered = [...results];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    setResults(reordered);
  };

  const moveDown = async (index) => {
    if (index === results.length - 1) return;
    const reordered = [...results];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    setResults(reordered);
  };

  const filtered = results.filter((r) =>
    !search ||
    r.runner_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.nationality?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedEvent = events.find((e) => String(e.id) === selectedEventId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leaderboard Results Management</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setError("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Event selector */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="form-control flex-1 min-w-[250px]">
            <label className="label">
              <span className="label-text font-medium">Select Event *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedEventId}
              onChange={(e) => { setSelectedEventId(e.target.value); setShowForm(false); }}
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
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Add Runner Result
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit form panel */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 ring-2 ring-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingId ? `Edit: ${form.runner_name || "Result"}` : "New Runner Result"}
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Runner Name *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${formErrors.runner_name ? "input-error" : ""}`}
                required
                value={form.runner_name}
                onChange={(e) => setForm({ ...form, runner_name: e.target.value })}
                placeholder="e.g. Li Wei"
              />
              {formErrors.runner_name && (
                <span className="text-xs text-red-500 mt-1">{formErrors.runner_name}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nationality *</span>
              </label>
              <div className="relative">
                <select
                  className={`select select-bordered w-full pl-10 ${formErrors.nationality ? "select-error" : ""}`}
                  required
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  {NATIONALITIES.map((n) => (
                    <option key={n.name} value={n.name}>{n.name}</option>
                  ))}
                </select>
                {form.nationality && (() => {
                  const nat = NATIONALITIES.find((n) => n.name === form.nationality);
                  return nat?.image_url ? (
                    <img
                      src={nat.image_url}
                      alt=""
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-4 rounded object-cover pointer-events-none"
                    />
                  ) : null;
                })()}
              </div>
              {formErrors.nationality && (
                <span className="text-xs text-red-500 mt-1">{formErrors.nationality}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Time *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered font-mono ${formErrors.time ? "input-error" : ""}`}
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: formatTimeInput(e.target.value) })}
                placeholder="MM:SS or HH:MM:SS"
              />
              {formErrors.time ? (
                <span className="text-xs text-red-500 mt-1">{formErrors.time}</span>
              ) : (
                <span className="text-xs text-gray-400 mt-1">Auto-formats to MM:SS or HH:MM:SS</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Avatar URL</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="/Avatar/1.svg"
                />
                {form.avatar && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border shrink-0 bg-base-200 flex items-center justify-center">
                    <img src={form.avatar} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex gap-2 pt-2 border-t">
              <button
                type="submit"
                className={`btn btn-primary ${saving ? "loading" : ""}`}
                disabled={saving}
              >
                {saving ? "Saving..." : editingId ? "Update Result" : "Create Result"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {selectedEventId && results.length > 0 && (
          <div className="p-4 border-b flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-500">
              {results.length} runner{results.length !== 1 ? "s" : ""}
              {selectedEvent ? ` for ${selectedEvent.name}` : ""}
            </span>
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                className="input input-bordered input-sm w-full pl-8"
                placeholder="Search runner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th className="w-20">Reorder</th>
                <th>Runner Name</th>
                <th>Nation</th>
                <th>Time</th>
                <th>Avatar</th>
                <th className="w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!selectedEventId ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">🏃</div>
                    Select an event above to manage its leaderboard results
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <span className="loading loading-spinner loading-md" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {search ? "No runners match your search." : "No results yet. Click \"Add Runner Result\" to start building the leaderboard."}
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => {
                  const nat = NATIONALITIES.find((n) => n.name === r.nationality);
                  const rank = results.indexOf(r) + 1;
                  const rankClass =
                    rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : rank === 3 ? "text-orange-600" : "";
                  return (
                    <tr key={r.id}>
                      <td className={`font-bold text-lg ${rankClass}`}>#{rank}</td>
                      <td>
                        <div className="flex flex-col gap-0.5">
                          <button
                            className="btn btn-ghost btn-xs cursor-pointer"
                            onClick={() => moveUp(results.indexOf(r))}
                            disabled={results.indexOf(r) === 0}
                            title="Move up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs cursor-pointer"
                            onClick={() => moveDown(results.indexOf(r))}
                            disabled={results.indexOf(r) === results.length - 1}
                            title="Move down"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="font-medium">{r.runner_name}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {nat?.image_url ? (
                            <img src={nat.image_url} alt="" className="w-6 h-4 rounded object-cover" />
                          ) : (
                            <span className="w-6 h-4 rounded bg-base-200 flex items-center justify-center text-[9px] font-bold text-gray-400">
                              ?
                            </span>
                          )}
                          {r.nationality}
                        </div>
                      </td>
                      <td className="font-mono font-semibold">{r.time}</td>
                      <td>
                        {r.avatar ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border bg-base-200">
                            <img src={r.avatar} alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = "none"; }} />
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
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
                            onClick={() => setDeleteTarget(r)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Delete Result</h3>
            <p className="text-gray-600 mb-1">
              Remove <strong>{deleteTarget.runner_name}</strong> from the leaderboard?
            </p>
            <p className="text-sm text-gray-400 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-error" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
