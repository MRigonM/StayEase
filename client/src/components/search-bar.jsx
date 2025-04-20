import React, { useState } from "react";
import { CalendarIcon, MapPin, Search, Users } from "lucide-react";
import { format } from "date-fns";

export function SearchBar() {
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [guestCount, setGuestCount] = useState("");

  const handleDateSelect = (from, to) => {
    setDate({ from, to });
    setShowCalendar(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium">
            <MapPin className="h-4 w-4 mr-2 text-teal-600" />
            <span>Destination</span>
          </div>
          <input
            type="text"
            placeholder="Where are you going?"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
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
                ? `${format(date.from, "MMM d, yyyy")} — ${format(
                    date.to,
                    "MMM d, yyyy"
                  )}`
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
                    handleDateSelect(
                      new Date(),
                      new Date(new Date().setDate(new Date().getDate() + 5))
                    )
                  }
                  className="mt-2 text-teal-500 underline"
                >
                  Select Mock Range
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium">
            <Users className="h-4 w-4 mr-2 text-teal-600" />
            <span>Guests</span>
          </div>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>
              Add guests
            </option>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5+">5+ guests</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <button className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-teal-700">
          <Search className="h-4 w-4 mr-2" />
          Search Stays
        </button>
      </div>
    </div>
  );
}
