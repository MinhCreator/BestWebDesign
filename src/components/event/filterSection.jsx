import React, { useState } from "react";
import  SearchBar  from "../ui/SearchBar"
const FilterSection = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: "all",
    location: "",
    distance: "",
    searchQuery: "",
  });

  const handleTypeChange = (type) => {
    const newFilters = { ...filters, type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (e) => {
    const newFilters = { ...filters, location: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDistanceChange = (e) => {
    const newFilters = { ...filters, distance: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value) => {
    const newFilters = { ...filters, searchQuery: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  return (
    <>
      <h1 className="flex ml-10 mt-8 font-bold text-emerald-900 text-4xl section-title">
        RUNNING EVENTS
      </h1>
      <div className="filter-section bg-teal-800 mt-2">
        <div className="filter-controls justify-between">
          <div className="filter-tags">
            <button
              className={`tag ${filters.type === "all" ? "tag-green" : "tag"}`}
              onClick={() => handleTypeChange("all")}
            >
              All
            </button>
            <button
              className={`tag ${filters.type === "marathon" ? "tag-green" : "tag"}`}
              onClick={() => handleTypeChange("marathon")}
            >
              Marathon
            </button>
            <button
              className={`tag ${filters.type === "trial" ? "tag-green" : "tag"}`}
              onClick={() => handleTypeChange("trial")}
            >
              Trial
            </button>
          </div>
          <SearchBar
            value={filters.searchQuery}
            classNameStyle=" w-full rounded border border-gray-200 py-2 pl-8 pr-3 text-sm focus:border-[#55b576] focus:ring-2 focus:ring-[#55b576]/20 focus:outline-none text-[#ffff]"
            onChange={handleSearchChange}
            placeholder="Search events"
          />

          <div className="filter-dropdowns">
            <select
              onChange={handleLocationChange}
              value={filters.location}
              className=""
            >
              <option value="">Area</option>
              <option value="st">Sơn Trà</option>
              <option value="hc">Hải Châu</option>
              <option value="nhs">Ngũ Hành Sơn</option>
              <option value="lc">Liên Chiểu</option>
            </select>
            <select onChange={handleDistanceChange} value={filters.distance}>
              <option value="">Distance</option>
              <option value="5k">5km</option>
              <option value="10k">10km</option>
              <option value="21k">21km</option>
              <option value="42k">42km</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSection;
