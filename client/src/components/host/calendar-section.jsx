import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, CalendarIcon } from "lucide-react";

export default function CalendarSection({ initialData = {}, updateData }) {
  const [formData, setFormData] = useState({
    basePrice: initialData.basePrice || 100,
    weekendPrice: initialData.weekendPrice || 120,
    minNights: initialData.minNights || 2,
    maxNights: initialData.maxNights || 14,
    instantBook: initialData.instantBook || true,
    selectedDates: initialData.selectedDates || [],
    blockedDates: initialData.blockedDates || [],
    specialPrices: initialData.specialPrices || {},
  });

  const [selectedTab, setSelectedTab] = useState("availability");
  const [dateSelectionMode, setDateSelectionMode] = useState("available");

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split("T")[0];

    if (dateSelectionMode === "available") {
      const newSelectedDates = [...formData.selectedDates];
      const newBlockedDates = formData.blockedDates.filter(
        (d) => d !== dateStr
      );

      if (!newSelectedDates.includes(dateStr)) {
        newSelectedDates.push(dateStr);
      } else {
        const index = newSelectedDates.indexOf(dateStr);
        newSelectedDates.splice(index, 1);
      }

      setFormData({
        ...formData,
        selectedDates: newSelectedDates,
        blockedDates: newBlockedDates,
      });

      updateData({
        ...formData,
        selectedDates: newSelectedDates,
        blockedDates: newBlockedDates,
      });
    } else {
      const newBlockedDates = [...formData.blockedDates];
      const newSelectedDates = formData.selectedDates.filter(
        (d) => d !== dateStr
      );

      if (!newBlockedDates.includes(dateStr)) {
        newBlockedDates.push(dateStr);
      } else {
        const index = newBlockedDates.indexOf(dateStr);
        newBlockedDates.splice(index, 1);
      }

      setFormData({
        ...formData,
        selectedDates: newSelectedDates,
        blockedDates: newBlockedDates,
      });

      updateData({
        ...formData,
        selectedDates: newSelectedDates,
        blockedDates: newBlockedDates,
      });
    }
  };

  // Helper function to generate days of a month
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 0);
    const days = [];
    for (let day = 1; day <= date.getDate(); day++) {
      days.push(new Date(year, month - 1, day));
    }
    return days;
  };

  // Get current month and year
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8">
      <div className="w-full">
        <div className="grid grid-cols-2">
          <button
            className={`p-4 ${selectedTab === "pricing" ? "bg-gray-200" : ""}`}
            onClick={() => setSelectedTab("pricing")}
          >
            Pricing
          </button>
          <button
            className={`p-4 ${
              selectedTab === "availability" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedTab("availability")}
          >
            Availability
          </button>
        </div>

        {selectedTab === "pricing" && (
          <motion.div variants={fadeIn} className="space-y-6 pt-4">
            <div className="space-y-4">
              <label className="text-lg font-medium flex items-center gap-2">
                <DollarSign size={18} /> Base Price (per night)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) =>
                      handleChange("basePrice", Number(e.target.value))
                    }
                    className="pl-8 w-full p-2 border border-gray-300 rounded-md"
                    min={1}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-medium flex items-center gap-2">
                <DollarSign size={18} /> Weekend Price (per night)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={formData.weekendPrice}
                    onChange={(e) =>
                      handleChange("weekendPrice", Number(e.target.value))
                    }
                    className="pl-8 w-full p-2 border border-gray-300 rounded-md"
                    min={1}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Minimum Nights</label>
                <span className="text-sm font-medium">
                  {formData.minNights} nights
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={formData.minNights}
                onChange={(e) =>
                  handleChange("minNights", Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Maximum Nights</label>
                <span className="text-sm font-medium">
                  {formData.maxNights} nights
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={formData.maxNights}
                onChange={(e) =>
                  handleChange("maxNights", Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-lg font-medium">Instant Book</label>
                <p className="text-sm text-muted-foreground">
                  Allow guests to book without sending a reservation request
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.instantBook}
                onChange={(e) => handleChange("instantBook", e.target.checked)}
                className="form-checkbox"
              />
            </div>
          </motion.div>
        )}

        {selectedTab === "availability" && (
          <motion.div variants={fadeIn} className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium flex items-center gap-2">
                <CalendarIcon size={18} /> Availability Calendar
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">Blocked</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className={`flex-1 cursor-pointer ${
                  dateSelectionMode === "available"
                    ? "border-green-500"
                    : "border-gray-200"
                }`}
                onClick={() => setDateSelectionMode("available")}
              >
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Mark as Available</span>
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 cursor-pointer ${
                  dateSelectionMode === "blocked"
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                onClick={() => setDateSelectionMode("blocked")}
              >
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span>Mark as Blocked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Display */}
            <div className="border rounded-md p-4">
              <div className="grid grid-cols-7 gap-2">
                <div className="text-center">Sun</div>
                <div className="text-center">Mon</div>
                <div className="text-center">Tue</div>
                <div className="text-center">Wed</div>
                <div className="text-center">Thu</div>
                <div className="text-center">Fri</div>
                <div className="text-center">Sat</div>
                {/* Render Days */}
                {daysInMonth.map((day) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const isSelected = formData.selectedDates.includes(dateStr);
                  const isBlocked = formData.blockedDates.includes(dateStr);

                  return (
                    <div
                      key={day.toString()}
                      className={`text-center cursor-pointer p-2 rounded-md ${
                        isSelected ? "bg-green-500 text-white" : ""
                      } ${isBlocked ? "bg-red-500 text-white" : ""}`}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
