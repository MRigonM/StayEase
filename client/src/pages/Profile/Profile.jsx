import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fullName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!fullName) {
          setLoading(false);
          return;
        }
        const userRes = await api.get(
          `/Users/GetUserByFullName/${encodeURIComponent(fullName)}`
        );
        setUser(userRes.data?.data || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500 text-xl font-semibold">User not found!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-logoColor to-purple-700 h-56">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="mt-20 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-logoColor">
              {user.properties?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Properties</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-logoColor">
              {user.bookings?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Bookings</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-logoColor">
              {user.reviews?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Reviews</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.username}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.phoneNumber || "—"}
            </p>
          </div>
          <div className="p-4 border rounded-lg md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.address}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 max-w-5xl mx-auto space-y-10 px-4">
        {/* Properties */}
        {user.properties?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Properties
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {user.properties.map((p, i) => (
                <div
                  key={i}
                  className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition"
                >
                  <h3 className="font-bold text-xl text-logoColor">{p.name}</h3>
                  <p className="text-gray-600 mt-1">{p.description}</p>
                  <div className="flex justify-between mt-3 text-sm text-gray-500">
                    <span>💰 ${p.nightPrice}/night</span>
                    <span>⭐ {p.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings */}
        {user.bookings?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Bookings
            </h2>
            <div className="space-y-4">
              {user.bookings.map((b, i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-xl shadow-sm"
                >
                  <p className="text-gray-800 font-semibold">
                    {new Date(b.startDate).toLocaleDateString()} →{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Payment: {b.paymentMethod} ({b.paymentDate})
                  </p>
                  <p className="font-bold text-logoColor">
                    Total: ${b.totalPrice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {user.reviews?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Reviews
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {user.reviews.map((r, i) => (
                <div
                  key={i}
                  className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition"
                >
                  <p className="text-gray-800 italic">"{r.comment}"</p>
                  <p className="text-yellow-500 font-bold mt-2">⭐ {r.stars}/5</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
