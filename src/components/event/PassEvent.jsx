import React from "react";

const mockEvents = [
  {
    id: 1,
    name: "Nha trang International Marathon",
    type: "marathon",
    location: "Nha Trang beach",
    distance: "42km",
    date: "27/07/2026",
    route: "",
    organizer: "Endurance hub",
    image: "src/assets/image/nhatrang.jpg",
  },
  {
    id: 2,
    name: "Dragon brigde running tournament",
    type: "trial",
    location: "Dragon brigde Peninsula",
    distance: "36km",
    date: "12/08/2026",
    route: "",
    organizer: "Endurance hub",
    image: "src/assets/image/caurong.jpg",
  },
  {
    id: 3,
    name: "Ha long Bay Run - community race",
    type: "marathon",
    location: "Dragon Bridge",
    distance: "10km",
    date: "05/09/2026",
    route: "",
    organizer: "Endurance hub",
    image: "src/assets/image/halongbay.jpg",
  },
  {
    id: 4,
    name: "Hue Marathon - Challenge",
    type: "marathon",
    location: "Hai Van Pass",
    distance: "42km",
    date: "22/10/2026",
    route: "",
    organizer: "Endurance Hub",
    image: "src/assets/image/hue.jpg",
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
            <div className="card-image w-auto h-5">
              <img src={Card.image} alt="" />
            </div>
            <div className="card-content font-bold text-md">
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
