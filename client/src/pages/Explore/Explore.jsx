"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "https://localhost:5000/api/Property/GetProperties";

const Explore = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(API_URL, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const mapped = json.data.map((p, idx) => {
          let avgRating = 0;
          if (p.reviews && p.reviews.length > 0) {
            avgRating =
              p.reviews.reduce((sum, r) => sum + r.stars, 0) /
              p.reviews.length;
          }

          return {
            id: idx,
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
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore Properties
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Discover unique homes, villas, apartments and more – all around the
          world. Choose your next stay and start your adventure today!
        </p>
      </section>

      {/* Properties Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {loading && <p className="text-gray-500">Loading properties…</p>}
        {err && <p className="text-red-600">Error: {err}</p>}

        {!loading && !err && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((property) => (
              <Link to={`/details/${property.id}`}
                key={property.id}
                className="rounded-xl overflow-hidden bg-white border shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative h-48 w-full">
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
                          className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-teal-600" />
                    {property.location}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({property.reviews.length})
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">${property.price}</span>
                      <span className="text-gray-500"> / night</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {items.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-8">
            No properties found.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} StayEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Explore;
