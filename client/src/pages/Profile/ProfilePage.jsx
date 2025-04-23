import { useEffect, useState } from "react";
import { Edit, Star, Home, CalendarCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  location: "New York, USA",
  bio: "Traveler. Photographer. Airbnb Superhost.",
  avatar: "https://i.pravatar.cc/150?img=12"
};

export default function ProfilePage() {
  const [tab, setTab] = useState("info");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      if (!userId || !token) return;

      try {
        const response = await axios.get(`http://localhost:2001/api/ApplicationUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={mockUser.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.userName}</h2>
            <p className="text-gray-600">{mockUser.location}</p>
            <p className="text-sm text-gray-500 mt-1">{mockUser.bio}</p>
          </div>
          <button className="p-2 border rounded hover:bg-gray-100">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        <button
          className={`py-2 px-4 rounded ${tab === "info" ? "bg-logoColor text-white" : "bg-gray-100"}`}
          onClick={() => setTab("info")}
        >
          <Edit className="w-4 h-4 inline mr-1" /> Info
        </button>
        <button
          className={`py-2 px-4 rounded ${tab === "bookings" ? "bg-logoColor text-white" : "bg-gray-100"}`}
          onClick={() => setTab("bookings")}
        >
          <CalendarCheck className="w-4 h-4 inline mr-1" /> Bookings
        </button>
        <button
          className={`py-2 px-4 rounded ${tab === "listings" ? "bg-logoColor text-white" : "bg-gray-100"}`}
          onClick={() => setTab("listings")}
        >
          <Home className="w-4 h-4 inline mr-1" /> Listings
        </button>
        <button
          className={`py-2 px-4 rounded ${tab === "reviews" ? "bg-logoColor text-white" : "bg-gray-100"}`}
          onClick={() => setTab("reviews")}
        >
          <Star className="w-4 h-4 inline mr-1" /> Reviews
        </button>
      </div>

      {tab === "info" && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" defaultValue={mockUser.name} className="mt-1 w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" defaultValue={mockUser.email} className="mt-1 w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea defaultValue={mockUser.bio} className="mt-1 w-full border rounded p-2" />
          </div>
          <button className="mt-2 px-4 py-2 bg-logoColor text-white rounded">Save Changes</button>
        </div>
      )}

      {tab === "bookings" && (
        <div className="bg-white shadow rounded-lg p-6 text-gray-500">
          You have no bookings yet.
        </div>
      )}

      {tab === "listings" && (
        <div className="bg-white shadow rounded-lg p-6 text-gray-500">
          No listings created. Start hosting now!
        </div>
      )}

      {tab === "reviews" && (
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <div className="text-sm text-gray-600">★ 5 - "Great host, awesome stay!"</div>
          <div className="text-sm text-gray-600">★ 4 - "Nice apartment, could be cleaner."</div>
        </div>
      )}
    </div>
    </>
  );
}
