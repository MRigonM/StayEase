"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Info } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapSection({ initialData = {}, updateData }) {
  const [formData, setFormData] = useState({
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zipCode: initialData.zipCode || "",
    country: initialData.country || "",
    latitude: initialData.latitude || null,
    longitude: initialData.longitude || null,
    neighborhood: initialData.neighborhood || "",
    hideExactLocation: initialData.hideExactLocation || false,
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(newData);
  };

const handleSearch = async () => {
  const query = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`;
  const apiKey = process.env.REACT_APP_PUBLIC_OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      const newData = {
        ...formData,
        latitude: lat,
        longitude: lng,
      };
      setFormData(newData);
      updateData(newData);
    } else {
      alert("Location not found. Please check the address details.");
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    alert("Failed to fetch location. Please try again.");
  }
};


  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8">
      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium">Property Location</label>
          <div className="relative">
            <button
              type="button"
              className="text-gray-400"
              aria-label="More Info"
              data-tooltip="Your exact address will only be shared with guests after they book"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4 md:col-span-2">
            <label htmlFor="address">Street Address</label>
            <input
              id="address"
              type="text"
              placeholder="123 Main St"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              placeholder="New York"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="state">State/Province</label>
            <input
              id="state"
              type="text"
              placeholder="NY"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="zipCode">Zip/Postal Code</label>
            <input
              id="zipCode"
              type="text"
              placeholder="10001"
              value={formData.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              placeholder="United States"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            <Search size={16} /> Find on Map
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <label className="text-lg font-medium">Map Preview</label>

        <div className="overflow-hidden border border-gray-200">
          <div className="p-0 aspect-video relative">
            <div className="absolute inset-0">
              {formData.latitude && formData.longitude ? (
                <MapContainer
                  center={[formData.latitude, formData.longitude]}
                  zoom={20}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[formData.latitude, formData.longitude]}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        const newData = {
                          ...formData,
                          latitude: position.lat,
                          longitude: position.lng,
                        };
                        setFormData(newData);
                        updateData(newData);
                      },
                    }}
                  />

                  <MapUpdater
                    center={[formData.latitude, formData.longitude]}
                  />
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center p-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter your address and click "Find on Map" to see the
                      location
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-2">
          <input
            id="hideExactLocation"
            type="checkbox"
            checked={formData.hideExactLocation}
            onChange={(e) =>
              handleChange("hideExactLocation", e.target.checked)
            }
            className="h-4 w-4 text-blue-500 border-gray-300 rounded"
          />
          <div className="space-y-1">
            <label htmlFor="hideExactLocation" className="font-medium">
              Hide exact location
            </label>
            <p className="text-sm text-gray-500">
              Show only approximate location on the public listing
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <label htmlFor="neighborhood" className="text-lg font-medium">
          Describe Your Neighborhood
        </label>
        <textarea
          id="neighborhood"
          placeholder="Tell guests about the neighborhood, nearby attractions, public transportation, etc."
          value={formData.neighborhood}
          onChange={(e) => handleChange("neighborhood", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md min-h-24"
        />
      </motion.div>
    </div>
  );
}

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}
