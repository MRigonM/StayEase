"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  Home,
  Calendar,
  MessageSquare,
  User,
  MapPin,
} from "lucide-react";
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
      <div className="relative bg-[#FF385C] h-64 flex items-center justify-center">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="h-12 w-12 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 relative">
        <div className="absolute top-4 right-4">
          <Link to="/settings">
            <Settings className="h-6 w-6 text-gray-700 hover:text-[#FF385C] transition" />
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <Home className="h-6 w-6 mx-auto text-[#FF385C] mb-2" />
            <p className="text-2xl font-bold text-[#FF385C]">
              {user.properties?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Properties</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <Calendar className="h-6 w-6 mx-auto text-[#FF385C] mb-2" />
            <p className="text-2xl font-bold text-[#FF385C]">
              {user.bookings?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Bookings</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <MessageSquare className="h-6 w-6 mx-auto text-[#FF385C] mb-2" />
            <p className="text-2xl font-bold text-[#FF385C]">
              {user.reviews?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Reviews</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 max-w-6xl mx-auto space-y-12 px-4 pb-20">
        {/* Properties */}
        {user.properties?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Properties
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.properties.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <img
                          src={
                            p.imageUrls?.length > 0
                              ? `https://localhost:5000/${p.imageUrls[0]}`
                              : "https://placehold.co/100x80/png"
                          }
                          alt={p.name}
                          className="w-20 h-16 object-cover rounded-md border"
                        />
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        {p.name}
                      </td>
                      <td className="p-4 text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        {p.location?.name ||
                          p.country?.name ||
                          p.region?.name ||
                          "Unknown"}
                      </td>
                      <td className="p-4 font-medium text-[#FF385C]">
                        €{p.nightPrice}/night
                      </td>
                      <td className="p-4 text-yellow-500">
                        ⭐ {p.rate || "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {user.bookings?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Bookings
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="p-4">Dates</th>
                    <th className="p-4">Property</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Payment Date</th>
                    <th className="p-4">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">
                        {new Date(b.startDate).toLocaleDateString()} →{" "}
                        {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {b.property?.name || "—"}
                      </td>
                      <td className="p-4 text-gray-600">{b.paymentMethod}</td>
                      <td className="p-4 text-gray-600">
                        {b.paymentDate
                          ? new Date(b.paymentDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-4 font-bold text-[#FF385C]">
                        €{b.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews */}
        {user.reviews?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Reviews
            </h2>
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4">Stars</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">
                        {r.property?.name || "—"}
                      </td>
                      <td className="p-4 text-gray-600 italic">
                        "{r.comment}"
                      </td>
                      <td className="p-4 text-yellow-500 font-bold">
                        ⭐ {r.stars}/5
                      </td>
                      <td className="p-4 text-gray-600">
                        {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
