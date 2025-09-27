import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";
import { MapPin } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!fullName) {
          setLoading(false);
          return;
        }

        // 1. Merr user-in ose direkt bookings nga API
        const userRes = await api.get(
          `/Users/GetUserByFullName/${encodeURIComponent(fullName)}`
        );
        const bookingsRes = userRes.data?.data?.bookings || [];

        // 2. Për çdo booking, merr edhe pronën (duke përdorur query param)
        const bookingsWithProperty = await Promise.all(
          bookingsRes.map(async (b) => {
            try {
              const propertyRes = await api.get(
                `/Property/GetProperty?propertyId=${b.propertyId}`
              );
              const p = propertyRes.data?.data;

              const mappedProperty = p
                ? {
                    id: p.id,
                    title: p.name,
                    description: p.description,
                    price: p.nightPrice,
                    image:
                      p.imageUrls && p.imageUrls.length > 0
                        ? `https://localhost:5000/${p.imageUrls[0]}`
                        : "https://placehold.co/600x400/png",
                    location:
                      p.location?.name ||
                      p.country?.name ||
                      p.region?.name ||
                      "Unknown location",
                    tags: p.placeType ? [p.placeType] : [],
                  }
                : null;

              return { ...b, property: mappedProperty };
            } catch (err) {
              console.error("Error fetching property:", err);
              return { ...b, property: null };
            }
          })
        );

        setBookings(bookingsWithProperty);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [fullName]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logoColor"></div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-xl font-semibold">
            You have no bookings yet!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              {/* Property Image */}
              {b.property?.image ? (
                <img
                  src={b.property.image}
                  alt={b.property.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              {/* Property Info */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-logoColor">
                  {b.property?.title || "Unknown Property"}
                </h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {b.property?.description || "No description available."}
                </p>

                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1 text-teal-600" />
                  {b.property?.location}
                </div>

                {/* Booking Dates */}
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>
                    {new Date(b.startDate).toLocaleDateString()} →{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-logoColor">
                    ${b.totalPrice}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>
                    Payment:{" "}
                    <span className="font-semibold">
                      {b.paymentMethod || "N/A"}
                    </span>
                  </p>
                  {b.paymentDate && (
                    <p>
                      Paid on:{" "}
                      {new Date(b.paymentDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mt-4">
    <button
  onClick={async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      await api.put(`/Booking/CancelBooking?bookingId=${b.id}`);
      alert("Booking cancelled successfully!");
      setBookings((prev) => prev.filter((x) => x.id !== b.id));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Try again.");
    }
  }}
  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
>
  Cancel Booking
</button>

    </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
