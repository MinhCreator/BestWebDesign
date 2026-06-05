import React, { useState } from "react";

const Register = ({ event: selectedEvent, onClose }) => {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const body = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", phone: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(body.detail || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-80 rounded-2xl border border-surface-container bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-outfit text-headline-md text-on-surface leading-none">
                Register
              </h2>
              <p className="mt-0.5 text-body-md text-outline">
                {selectedEvent.name}
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-primary/5 py-10">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-outfit text-headline-md text-on-surface">You're in!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-inter text-label-bold text-on-surface/80">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface placeholder:text-outline transition-all duration-200 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/15"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-inter text-label-bold text-on-surface/80">
                Phone number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0234 123 123"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface placeholder:text-outline transition-all duration-200 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/15"
                required
              />
            </div>

            {error && (
              <p className="text-body-md text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-6 py-3 text-body-md font-semibold text-primary-content shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            >
              Submit registration
            </button>
          </form>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="font-inter text-[11px] font-medium text-outline">
            {selectedEvent.organizer}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
