"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";

const API_URL = "https://localhost:5000/api/Property/GetProperties";

const Details = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState(null);
  const [bookSuccess, setBookSuccess] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
        const json = await res.json();
        const selected = json.data.find((_, idx) => String(idx) === id);
        setProperty(selected);
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!property) return <p className="p-6 text-red-500">Property not found.</p>;

  const dateToISO = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setHours(12, 0, 0, 0);
    return d.toISOString();
  };


  const getNights = () => {
    if (!startDate || !endDate) return 2;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotalPrice = () => {
    const nights = getNights();
    return property ? property.nightPrice * nights : 0;
  };


  const openModal = () => {
    setBookError(null);
    setBookSuccess(null);
    setStartDate("");
    setEndDate("");
    setShowModal(true);
  };
  const submitBooking = async (e) => {
    e.preventDefault();
    setBookError(null);
    setBookSuccess(null);

    if (!startDate || !endDate) {
      setBookError("Please provide both start and end dates.");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    if (!(start > now)) {
      setBookError("Start date must be in the future.");
      return;
    }
    if (!(end > start)) {
      setBookError("End date must be after start date.");
      return;
    }

    const payload = {
      startDate: dateToISO(startDate),
      endDate: dateToISO(endDate),
      propertyId: String(id),
    };

    try {
      setSubmitting(true);
      const res = await api.post("/Booking/CreateBooking", payload);
      if (res?.data?.isSuccess) {
        setBookSuccess(res.data.message || "Booked successfully!");
        setTimeout(() => setShowModal(false), 1200);
      } else {
        setBookError(res?.data?.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setBookError("You must be logged in to book. Please login and try again.");
      } else {
        const serverMsg = err?.response?.data?.message || err?.response?.data?.errors || err.message;
        setBookError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Link to="/explore" className="text-teal-600 hover:underline mb-6 inline-block">
            ← Back to Explore
          </Link>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <img
                  src={property.imageUrls?.length > 0
                      ? `https://localhost:5000/${property.imageUrls[currentImage]}`
                      : "https://placehold.co/1200x800/png"}
                  alt={property.name}
                  className="w-full h-[450px] md:h-[450px] object-cover rounded-xl shadow-lg mb-4"
              />

              <div className="flex gap-2 overflow-x-auto">
                {property.imageUrls?.map((img, idx) => (
                    <img
                        key={idx}
                        src={`https://localhost:5000/${img}`}
                        alt={`Thumbnail ${idx}`}
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                            currentImage === idx ? "border-teal-600" : "border-transparent"
                        }`}
                        onClick={() => setCurrentImage(idx)}
                    />
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{property.name}</h1>
              <p className="text-gray-600 mb-4">{property.description}</p>

              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                <span>{property.location?.name}, {property.country?.name}</span>
              </div>

              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">
                {property.reviews?.length
                    ? (property.reviews.reduce((s, r) => s + r.stars, 0) / property.reviews.length).toFixed(1)
                    : "No rating"}
              </span>
                <span className="text-gray-500 ml-2">({property.reviews?.length || 0} reviews)</span>
              </div>
              <div className="my-3">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="flex gap-2 flex-wrap">
                    {property.categories?.map((c, i) => (
                        <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">
                    {c.name}
                  </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Room Services</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {property.roomServices?.map((s, i) => (
                        <li key={i}>{s.description}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-md my-6">
                  {/* Price */}
                  <div className="text-2xl md:text-2xl font-bold mb-4">
                    €{calculateTotalPrice()} <span className="text-gray-500 text-base">{getNights()} nights</span>
                  </div>

                  <form onSubmit={submitBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Check-in</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border px-2 py-2 rounded-lg"
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Check-out</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                            min={startDate || new Date().toISOString().split("T")[0]}
                            required
                        />
                      </div>
                    </div>
                    {bookError && <p className="text-red-600 font-bold">{bookError}</p>}
                    {bookSuccess && <p className="text-green-600 font-bold">{bookSuccess}</p>}

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition"
                        disabled={submitting}
                    >
                      {submitting ? "Reserving..." : "Reserve"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {property.reviews?.length > 0 && (
              <div className="mt-3">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {property.reviews.map((r, i) => (
                      <div key={i} className="p-4 border rounded-lg shadow-sm bg-white">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{r.stars}</span>
                        </div>
                        <p className="text-gray-700 italic">"{r.comment}"</p>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </>
  );
  
};

export default Details;
