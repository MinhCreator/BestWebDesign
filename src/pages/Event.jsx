import "@css/Event.css";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import EventList from "@components/event/EventList";
import FilterSection from "@components/event/filterSection";
import Hero from "@components/event/Hero";
import MapSection from "@components/event/MapSection";
import RegisterEvent from "@components/event/RegisterEvent";
import { useState } from "react";
import Breadcrumb from "@components/ui/Breadcrumbs";

const Event = () => {
  const [filters, setFilters] = useState({
    type: "all",
    location: "",
    distance: ""
  });

  return (
    <>
      <Hero />
      <FilterSection onFilterChange={setFilters} />
      <EventList filters={filters} />
      <MapSection />
      <RegisterEvent />
    </>
  );
};

export default Event;
