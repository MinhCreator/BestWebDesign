import "../style/Event.css";
import EventList from "../components/event/EventList";
import FilterSection from "../components/event/filterSection";
import Hero from "../components/event/Hero";
import MapSection from "../components/event/MapSection";
import PassEvent from "../components/event/PassEvent";
import { useState } from "react";

const Event = () => {
  const [filters, setFilters] = useState({
    type: "all",
    location: "",
    distance: "",
  });

  return (
    <>
      <Hero />
      <FilterSection onFilterChange={setFilters} />
      <EventList filters={filters} />
      <MapSection />
      <PassEvent />
    </>
  );
};

export default Event;
