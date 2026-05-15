import React from "react";

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

const PassEvent = () => {
  return (
    <>
      <h1 className="flex ml-10 font-bold text-emerald-900 text-4xl">
        PAST RUNNING EVENTS
      </h1>
      <div className="event-list">
        {mockEvents.map((Card, index) => (
          <div className="card" key={index}>
            <div className="card-image">{Card.image}</div>
            <div className="card-content">
              <h3 className="">{Card.name}</h3>
              <p>{Card.organizer}</p>
              <p>- {Card.date} -</p>
              <div className="card-bottom">
                <span>{Card.distance}</span>
                <button className="past-btn">Completed</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PassEvent;
