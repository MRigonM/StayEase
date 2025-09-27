import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fullName = localStorage.getItem("userName");

  // formData për editim
  const [formData, setFormData] = useState({
    firstName: "",
    middlName: "",
    lastName: "",
    email: "",
    userName: "",
    address: "",
    phoneNumber: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!fullName) {
          setLoading(false);
          return;
        }
        const res = await api.get(
          `/Users/GetUserByFullName/${encodeURIComponent(fullName)}`
        );
        const userData = res.data?.data || null;
        setUser(userData);

        if (userData) {
          // ndajmë fullName në pjesë
          const nameParts = userData.fullName?.trim().split(" ") || [];
          let firstName = "";
          let middlName = "";
          let lastName = "";

          if (nameParts.length === 1) {
            firstName = nameParts[0];
          } else if (nameParts.length === 2) {
            firstName = nameParts[0];
            lastName = nameParts[1];
          } else if (nameParts.length >= 3) {
            firstName = nameParts[0];
            lastName = nameParts[nameParts.length - 1];
            middlName = nameParts.slice(1, -1).join(" "); // nëse ka më shumë se 3 pjesë
          }

          setFormData({
            firstName,
            middlName,
            lastName,
            email: userData.email || "",
            userName: userData.username || "",
            address: userData.address || "",
            phoneNumber: userData.phoneNumber || "",
            profileImage: null,
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [fullName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!user?.id) {
        setError("User not found.");
        return;
      }

      const form = new FormData();
      form.append("FirstName", formData.firstName);
      form.append("MiddlName", formData.middlName);
      form.append("LastName", formData.lastName);
      form.append("Email", formData.email);
      form.append("UserName", formData.userName);
      form.append("Address", formData.address);
      form.append("PhoneNumber", formData.phoneNumber);
      if (formData.profileImage) {
        form.append("ProfileImage", formData.profileImage);
      }

      const userId = user.id || user.Id;
      const res = await api.put(`/Users/UpdateUser?Id=${userId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.isSuccess) {
        setMessage("✅ Profile updated successfully!");
      } else {
        setError(res.data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

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
          <p className="text-red-500 text-lg font-semibold">User not found!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-12 bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          ⚙️ Edit Profile
        </h1>

        {message && (
          <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {/* First, Middle, Last Name */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middlName"
                value={formData.middlName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
          </div>

          {/* Email & Username */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
          </div>

          {/* Phone & Address */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
              />
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 w-full text-sm text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-logoColor to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition font-semibold"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
