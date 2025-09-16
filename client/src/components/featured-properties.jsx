"use client";

import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";

const API_URL = "https://localhost:5000/api/Property/GetProperties";

export function FeaturedProperties() {
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
        console.log("API RESPONSE:", json);

        const mapped = json.data.map((p, idx) => {
          // Llogarit rating mesatar nga reviews
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
            rating: avgRating,
            reviews: p.reviews ? p.reviews.length : 0,
            image:
              p.imageUrls && p.imageUrls.length > 0
                ? p.imageUrls[0]
                : "https://placehold.co/600x400/png",
            location:
              p.location?.name ||
              p.country?.name ||
              p.region?.name ||
              "Unknown location",
            tags: p.placeType ? [p.placeType] : [],
          };
        });

        // Sorto sipas rating dhe merre top 10
        const topTen = mapped
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10)
          .map((p) => ({
            ...p,
            rating: p.rating.toFixed(1),
          }));

        setItems(topTen);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Top 10 Properties
        </h2>

        {loading && <p className="text-gray-500">Loading properties…</p>}
        {err && <p className="text-red-600">Error: {err}</p>}

        {!loading && !err && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((property) => (
              <div
                key={property.id}
                className="rounded-xl overflow-hidden border hover:shadow-lg transition-shadow"
              >
                <div className="relative h-[200px] w-full">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-white/80 text-black rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-teal-600" />
                    {property.location}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({property.reviews})
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">${property.price}</span>
                      <span className="text-gray-500"> / night</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-gray-500">No properties found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
