import React from "react";
import { useEvents } from "../../hooks/useEvents";
import Spinner from "../../views/spinner/Spinner";

// const mockEvents = [
//   {
//     id: 1,
//     name: "Nha trang International Marathon",
//     type: "marathon",
//     location: "Nha Trang beach",
//     distance: "42km",
//     date: "27/07/2026",
//     route: "",
//     organizer: "Endurance hub",
//     image: "/image/nhatrang.jpg",
//   },
//   {
//     id: 2,
//     name: "Dragon brigde running tournament",
//     type: "trial",
//     location: "Dragon brigde Peninsula",
//     distance: "36km",
//     date: "12/08/2026",
//     route: "",
//     organizer: "Endurance hub",
//     image: "/image/caurong.jpg",
//   },
//   {
//     id: 3,
//     name: "Ha long Bay Run - community race",
//     type: "marathon",
//     location: "Dragon Bridge",
//     distance: "10km",
//     date: "05/09/2026",
//     route: "",
//     organizer: "Endurance hub",
//     image: "/image/halongbay.jpg",
//   },
//   {
//     id: 4,
//     name: "Hue Marathon - Challenge",
//     type: "marathon",
//     location: "Hai Van Pass",
//     distance: "42km",
//     date: "22/10/2026",
//     route: "",
//     organizer: "Endurance Hub",
//     image: "/image/hue.jpg",
//   },
// ];

function pastEventlist(isloading, Error, event) {
  if (isloading) {
    return <Spinner />;
  }
  if (Error) {
    return (
      <div className="text-center text-red-500 ml-10">
        Failed to load past events. Please try again later.
      </div>
    );
  }

   if (event.length === 0)
     return (
       <div className="text-center ml-10 text-gray-500">
         No past events available.
       </div>
     );


  return (
    <>
      {event.map((Card, index) => (
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
    </>
  );
}

const PassEvent = () => {
  const { data: events = [], isLoading, error } = useEvents();

  const pastEvents = events.filter((card) => card.status === "past");

  return (
    <>
      <h1 className="flex ml-10 font-bold text-emerald-900 text-4xl">
        PAST RUNNING EVENTS
      </h1>

      <div className="event-list">
        {pastEventlist(isLoading, error, pastEvents)}
      </div>
    </>
  );
};

export default PassEvent;
