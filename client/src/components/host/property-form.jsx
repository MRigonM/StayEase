import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Bed, Bath, Users, Wifi, Utensils, AirVent, Layers, Tv, WashingMachine, Wind, WavesLadder, Bubbles, ParkingCircle, Dumbbell, EggFried } from "lucide-react";

const propertyTypes = [
  "Entire home",
  "Apartment",
  "Guesthouse",
  "Hotel",
  "Cabin",
  "Villa",
  "Condo",
  "Other",
];

const amenities = [
  { id: "wifi", label: "WiFi", icon: <Wifi size={16} /> },
  { id: "kitchen", label: "Kitchen", icon: <Utensils size={16} /> },
  { id: "ac", label: "Air conditioning", icon: <AirVent size={16} /> },
  { id: "workspace", label: "Dedicated workspace", icon: <Layers size={16} /> },
  { id: "tv", label: "TV", icon: <Tv size={16} /> },
  { id: "washer", label: "Washer", icon: <WashingMachine size={16} /> },
  { id: "dryer", label: "Dryer", icon: <Wind size={16} /> },
  { id: "pool", label: "Pool", icon: <WavesLadder size={16} /> },
  { id: "hottub", label: "Hot tub", icon: <Bubbles size={16} /> },
  { id: "parking", label: "Free parking", icon: <ParkingCircle size={16} /> },
  { id: "gym", label: "Gym", icon: <Dumbbell size={16} /> },
  { id: "breakfast", label: "Breakfast", icon: <EggFried size={16} /> },
];

export default function PropertyForm({ initialData = {}, updateData }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    propertyType: initialData.propertyType || "",
    bedrooms: initialData.bedrooms || 1,
    bathrooms: initialData.bathrooms || 1,
    maxGuests: initialData.maxGuests || 2,
    amenities: initialData.amenities || [],
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

  const handleAmenityToggle = (amenityId) => {
    const currentAmenities = [...formData.amenities];
    const index = currentAmenities.indexOf(amenityId);

    if (index === -1) {
      currentAmenities.push(amenityId);
    } else {
      currentAmenities.splice(index, 1);
    }

    handleChange("amenities", currentAmenities);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8">
      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="title" className="text-lg font-medium">
            Property Title
          </label>
          <div className="relative">
            <button type="button" className="text-gray-400">
              <Info size={16} />
            </button>
            <div className="absolute hidden bg-gray-100 text-black text-xs p-2 rounded-md top-full mt-2">
              Create a catchy title that highlights the best features of your
              property
            </div>
          </div>
        </div>
        <input
          id="title"
          type="text"
          placeholder="e.g. Cozy Beachfront Villa with Amazing Sunset Views"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="text-lg font-medium">
            Property Description
          </label>
          <div className="relative">
            <button type="button" className="text-gray-400">
              <Info size={16} />
            </button>
            <div className="absolute hidden bg-gray-100 text-black text-xs p-2 rounded-md top-full mt-2">
              Describe what makes your place special and what guests can expect
            </div>
          </div>
        </div>
        <textarea
          id="description"
          placeholder="Tell potential guests about your property, the neighborhood, and what they can expect during their stay..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full p-3 min-h-32 border border-gray-300 rounded-md"
        />
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <label htmlFor="propertyType" className="text-lg font-medium">
          Property Type
        </label>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          <option value="">Select property type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="space-y-4">
          <label
            htmlFor="bedrooms"
            className="text-lg font-medium flex items-center gap-2"
          >
            <Bed size={18} /> Bedrooms
          </label>
          <select
            id="bedrooms"
            value={formData.bedrooms.toString()}
            onChange={(e) =>
              handleChange("bedrooms", Number.parseInt(e.target.value))
            }
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="bathrooms"
            className="text-lg font-medium flex items-center gap-2"
          >
            <Bath size={18} /> Bathrooms
          </label>
          <select
            id="bathrooms"
            value={formData.bathrooms.toString()}
            onChange={(e) =>
              handleChange("bathrooms", Number.parseInt(e.target.value))
            }
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label
            htmlFor="maxGuests"
            className="text-lg font-medium flex items-center gap-2"
          >
            <Users size={18} /> Max Guests
          </label>
          <select
            id="maxGuests"
            value={formData.maxGuests.toString()}
            onChange={(e) =>
              handleChange("maxGuests", Number.parseInt(e.target.value))
            }
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
              (num) => (
                <option key={num} value={num.toString()}>
                  {num}
                </option>
              )
            )}
          </select>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <label className="text-lg font-medium">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="border p-4 rounded-md">
              <label
                htmlFor={`amenity-${amenity.id}`}
                className={`flex items-center gap-3 cursor-pointer transition-colors ${
                  formData.amenities.includes(amenity.id)
                    ? "bg-green-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  id={`amenity-${amenity.id}`}
                  checked={formData.amenities.includes(amenity.id)}
                  onChange={() => handleAmenityToggle(amenity.id)}
                  className={`form-checkbox ${
                    formData.amenities.includes(amenity.id)
                      ? "text-green-600"
                      : ""
                  }`}
                />
                <div className="flex items-center gap-2">
                  {amenity.icon}
                  <span>{amenity.label}</span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
