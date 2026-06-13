import React, { useState } from "react";
import Register from "../ui/modal/Register";


const EventList = ({ filters }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);

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
      image: "/image/danang.png",
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
      image: "/image/sontra.webp",
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
      image: "/image/mykhe.jpg",
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
      image: "/image/haivan.jpg",
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
                <div className="flex gap-2">
                  <button onClick={() => handleViewNow(event)}>
                    {selectedEvent?.id === event.id ? "Close" : "View now"}
                  </button>
                  <button
                    onClick={() => setRegisteringEvent(event)}
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-content transition-all hover:brightness-110 active:scale-95"
                  >
                    Register
                  </button>
                </div>
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
        </div>
      )}

      {registeringEvent && (
        <Register event={registeringEvent} onClose={() => setRegisteringEvent(null)} />
      )}
    </>
  );
};

export default EventList;
