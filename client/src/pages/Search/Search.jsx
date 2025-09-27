"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";
import { MapPin, Star } from "lucide-react";

const Search = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get("/Property/GetProperties");
        let data = res.data?.data || [];

        // filtro në bazë të location nëse ka
        if (location) {
          data = data.filter((p) =>
            p.location?.name?.toLowerCase().includes(location.toLowerCase())
          );
        }

        // map properties për me i pasur një strukturë si Explore
        const mapped = data.map((p) => {
          let avgRating = 0;
          if (p.reviews && p.reviews.length > 0) {
            avgRating =
              p.reviews.reduce((sum, r) => sum + r.stars, 0) /
              p.reviews.length;
          }

          return {
            id: p.id,
            title: p.name,
            description: p.description,
            price: p.nightPrice,
            rating: avgRating.toFixed(1),
            reviews: p.reviews || [],
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
          };
        });

        setItems(mapped);
      } catch (error) {
        console.error(error);
        setErr("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          Search Results {location ? `for "${location}"` : ""}
        </h1>

        {loading && <p className="text-gray-500">Loading…</p>}
        {err && <p className="text-red-500">{err}</p>}

        {!loading && !err && items.length === 0 && (
          <p className="text-gray-500">No properties found.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {items.map((property) => (
    <Link
      to={`/details/${property.id}`}
      key={property.id}
      className="rounded-xl overflow-hidden bg-white border shadow-md hover:shadow-xl transition-shadow flex flex-col w-full"
    >
      <div className="relative h-56 w-full">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2">
            {property.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-teal-600" />
          {property.location}
        </div>
        <h3 className="font-bold text-xl mb-3">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {property.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{property.rating}</span>
            <span className="text-gray-500 ml-1">
              ({property.reviews.length})
            </span>
          </div>
          <div>
            <span className="font-bold text-lg">€{property.price}</span>
            <span className="text-gray-500"> / night</span>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>

      </div>
    </div>
  );
};

export default Search;
