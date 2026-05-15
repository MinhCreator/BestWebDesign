import React, { useState, useRef, useEffect } from "react";

const Register = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Registering:", formData);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsOpen(false);
        setFormData({ name: "", phone: "" });
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Register
      </button>
      <dialog
        ref={dialogRef}
        id="my_register_modal"
        className="modal"
        onClose={closeModal}
      >
        <div className="modal-box">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Register</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Name{" "}
                  <span className="text-red-500 font-bold font-2xl">*</span>
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Phone{" "}
                  <span className="text-red-500 font-bold font-2xl">*</span>
                </span>
              </label>
              <input
                type="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0234123123"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>
          </form>
          {/* <p className="py-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="link link-primary">
              Login here
            </a>
          </p> */}
        </div>
        <form method="dialog" className="modal-backdrop" onSubmit={closeModal}>
          <button type="submit" aria-label="Close">
            close
          </button>
        </form>
      </dialog>
    </>
  );
};

export default Register;
