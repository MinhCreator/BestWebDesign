import { useState, useEffect } from "react";
import {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/adminApi";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const emptyForm = {
  name: "",
  type: "marathon",
  location: "",
  distance: "",
  date: "",
  route: "",
  organizer: "",
  image: "",
  status: "running",
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async (status) => {
    setLoading(true);
    try {
      const data = await getAdminEvents(status);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(statusFilter);
  }, [statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setForm({
      name: event.name || "",
      type: event.type || "marathon",
      location: event.location || "",
      distance: event.distance || "",
      date: event.date || "",
      route: event.route || "",
      organizer: event.organizer || "",
      image: event.image || "",
      status: event.status || "running",
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateEvent(editingId, form);
      } else {
        await createEvent(form);
      }
      setShowForm(false);
      fetchEvents(statusFilter);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(eventId);
      fetchEvents(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (event) => {
    const newStatus = event.status === "running" ? "past" : "running";
    try {
      await updateEvent(event.id, { ...event, status: newStatus });
      fetchEvents(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* Status filter tabs */}
      <div className="tabs tabs-box mb-6 bg-white">
        <button
          className={`tab ${statusFilter === "" ? "tab-active" : ""}`}
          onClick={() => setStatusFilter("")}
        >
          All
        </button>
        <button
          className={`tab ${statusFilter === "running" ? "tab-active" : ""}`}
          onClick={() => setStatusFilter("running")}
        >
          Running
        </button>
        <button
          className={`tab ${statusFilter === "past" ? "tab-active" : ""}`}
          onClick={() => setStatusFilter("past")}
        >
          Past
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Event" : "New Event"}
          </h2>
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="marathon">Marathon</option>
                <option value="trial">Trial</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Distance</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
                placeholder="e.g. 42km"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. 27/07/2026"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Organizer *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={form.organizer}
                onChange={(e) =>
                  setForm({ ...form, organizer: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/image/event.png"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Route URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="running">Running</option>
                <option value="past">Past</option>
              </select>
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
                    ? "Update Event"
                    : "Create Event"}
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

      {/* Events table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Distance</th>
                <th>Date</th>
                <th>Organizer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event, i) => (
                  <tr key={event.id}>
                    <td>{i + 1}</td>
                    <td className="font-medium max-w-xs truncate">
                      {event.name}
                    </td>
                    <td>
                      <span className="badge badge-ghost">{event.type}</span>
                    </td>
                    <td className="text-sm">{event.location}</td>
                    <td>{event.distance}</td>
                    <td className="text-sm">{event.date}</td>
                    <td className="text-sm">{event.organizer}</td>
                    <td>
                      <span
                        className={`badge ${event.status === "running" ? "badge-success" : "badge-ghost"}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-xs cursor-pointer"
                          onClick={() => handleToggleStatus(event)}
                          title={
                            event.status === "running"
                              ? "Mark as past"
                              : "Mark as running"
                          }
                        >
                          {event.status === "running" ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                        <button
                          className="btn btn-ghost btn-xs cursor-pointer"
                          onClick={() => openEdit(event)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-red-500 cursor-pointer"
                          onClick={() => handleDelete(event.id)}
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
