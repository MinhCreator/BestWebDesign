import React, { useState } from "react";

const EventList = ({ filters }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  const mockEvents = [
    {
      id: 1,
      name: "Da Nang International Marathon",
      type: "marathon",
      location: "My Khe beach",
      distance: "42km",
      date: "27/07/2026",
      route: "",
      organizer: "Endurance hub",
      image: "public/image/danang.png",
    },
    {
      id: 2,
      name: "Son Tra Trail Challenge Terrain running tournament",
      type: "trial",
      location: "Son Tra Peninsula",
      distance: "36km",
      date: "12/08/2026",
      route: "",
      organizer: "Endurance hub",
      image: "public/image/sontra.webp",
    },
    {
      id: 3,
      name: "My Khe Beach Run - community race",
      type: "marathon",
      location: "Dragon Bridge",
      distance: "10km",
      date: "05/09/2026",
      route: "",
      organizer: "Endurance hub",
      image: "public/image/mykhe.jpg",
    },
    {
      id: 4,
      name: "Hai Van Pass Marathon - pass road Challenge",
      type: "marathon",
      location: "Hai Van Pass",
      distance: "42km",
      date: "22/10/2026",
      route: "",
      organizer: "Irace",
      image: "public/image/haivan.jpg",
    },
  ];

  const filteredEvents = mockEvents.filter((event) => {
    if (filters.type !== "all" && event.type !== filters.type) return false;
    if (filters.location && event.location !== filters.location) return false;
    if (filters.distance && event.distance !== filters.distance) return false;
    return true;
  });

  const handleViewNow = (event) => {
    if (selectedEvent?.id === event.id) {
      setSelectedEvent(null);
    } else {
      setSelectedEvent(event);
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering for", selectedEvent?.name, formData);
    alert(`Registered for "${selectedEvent?.name}" successfully!`);
    setFormData({ name: "", phone: "" });
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="event-list">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`card ${selectedEvent?.id === event.id ? "ring-2 ring-[#55b576]" : ""}`}
          >
            <div className="card-image">
              <img src={event.image} alt="" />
            </div>
            <div className="card-content font-bold text-md">
              <h3 className="">{event.name}</h3>
              <p>{event.organizer}</p>
              <p>- {event.date} -</p>
              <div className="card-bottom">
                <span>🏃 {event.distance}</span>
                <button onClick={() => handleViewNow(event)}>
                  {selectedEvent?.id === event.id ? "Close" : "View now"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="mx-10 mb-8 p-8 bg-white border border-[#dcdcdc] rounded-lg animate-fadeIn">
          <h3 className="text-2xl font-bold mb-2">{selectedEvent.name}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
            <p>
              <strong>Organizer:</strong> {selectedEvent.organizer}
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Distance:</strong> {selectedEvent.distance}
            </p>
          </div>

          <h4 className="text-lg font-semibold mb-4 text-[#55b576]">
            Register for this event
          </h4>
          <form onSubmit={handleRegister} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#55b576]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="0234123123"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#55b576]"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#55b576] text-white font-semibold px-6 py-2.5 rounded transition hover:bg-[#459a60]"
            >
              Register
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EventList;
