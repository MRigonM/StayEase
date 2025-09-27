"use client";
import React, { useState, useEffect } from "react";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../authService/AxiosInstance";

export function SearchBar() {
  const [date, setDate] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);
  const [dropdowns, setDropdowns] = useState({ countries: [], regions: [], locations: [] });
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  // Fetch dropdown data
  useEffect(() => {
    api.get("/Property/GetProperties").then((res) => {
      const props = res.data.data;

      const unique = (arr, key) =>
        Array.from(new Map(arr.map((i) => [i[key], i])).values());

      setDropdowns({
        countries: unique(props.map((p) => p.country), "id"),
        regions: unique(props.map((p) => p.region), "id"),
        locations: unique(props.map((p) => p.location), "id"),
      });
    });
  }, []);

  const handleDateSelect = (from, to) => {
    setDate({ from, to });
    setShowCalendar(false);
  };

  const handleSearch = () => {
    if (selectedLocation) {
      navigate(`/searchProp?location=${encodeURIComponent(selectedLocation)}`);
    } else {
      navigate("/searchProp");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Destination Dropdown */}
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium">
            <MapPin className="h-4 w-4 mr-2 text-teal-600" />
            <span>Destination</span>
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Location</option>
            {dropdowns.locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-2 md:col-span-2 relative">
          <div className="flex items-center text-sm font-medium">
            <CalendarIcon className="h-4 w-4 mr-2 text-teal-600" />
            <span>Check-in — Check-out</span>
          </div>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`w-full text-left px-3 py-2 border border-gray-300 rounded-lg ${
              !date.from ? "text-gray-400" : ""
            }`}
          >
            {date.from
              ? date.to
                ? `${format(date.from, "MMM d, yyyy")} — ${format(date.to, "MMM d, yyyy")}`
                : `${format(date.from, "MMM d, yyyy")}`
              : "Select dates"}
          </button>
          {showCalendar && (
            <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg p-4 z-10">
              {/* Simple Calendar UI Placeholder */}
              <div className="text-center">
                <p className="text-gray-500">Calendar UI goes here</p>
                <button
                  onClick={() =>
                    handleDateSelect(new Date(), new Date(new Date().setDate(new Date().getDate() + 5)))
                  }
                  className="mt-2 text-teal-500 underline"
                >
                  Select Mock Range
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-teal-700"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Stays
        </button>
      </div>
    </div>
  );
}
