import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";

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
        const userRes = await api.get(
          `/Users/GetUserByFullName/${encodeURIComponent(fullName)}`
        );
        const user = userRes.data?.data || null;
        console.log("Bookings response:", user?.bookings);
        setBookings(user?.bookings || []);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Bookings
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              {/* Property Image */}
              {b.property?.imageUrl ? (
                <img
                  src={b.property.imageUrl}
                  alt={b.property.name}
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
                  {b.property?.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {b.property?.description}
                </p>

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
                    Guests:{" "}
                    <span className="font-semibold">
                      {b.guests || 1}
                    </span>
                  </p>
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

                {/* Status */}
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${
                        b.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {b.status || "Pending"}
                  </span>
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
