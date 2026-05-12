import React from "react";

const EventList = ({ filters }) => {
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
      image: "Illustration photo",
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
      image: "Illustration photo",
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
      image: "Illustration photo",
    },
    {
      id: 4,
      name: "Hai Van Pass Marathon - pass road Challenge",
      type: "marathon",
      location: "Hai Van Pass",
      distance: "42km",
      date: "22/10/2026",
      route: "",
      organizer: "(Bộ phận tổ chức sự kiện)",
      image: "Illustration photo",
    },
  ];

  const filteredEvents = mockEvents.filter((event) => {
    if (filters.type !== "all" && event.type !== filters.type) return false;
    if (filters.location && event.location !== filters.location) return false;
    if (filters.distance && event.distance !== filters.distance) return false;
    return true;
  });

  return (
    <div className="event-list">
      {filteredEvents.map((event) => (
        <div key={event.id} className="card">
          <div className="card-image">{event.image}</div>
          <div className="card-content font-bold text-md">
            <h3 className="">{event.name}</h3>
            <p>{event.organizer}</p>
            <p>- {event.date} -</p>
            <div className="card-bottom">
              <span>🏃 {event.distance}</span>
              <button>Xem ngay</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
