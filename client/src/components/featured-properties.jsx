"use client";

import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

        const mapped = json.data.map((p) => {
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

        const topTen = mapped
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);

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
      <div className="container mx-auto px-4 md:px-6 relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Top 10 Properties
        </h2>

        {loading && <p className="text-gray-500">Loading properties…</p>}
        {err && <p className="text-red-600">Error: {err}</p>}

        {!loading && !err && (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {items.map((property) => (
              <SwiperSlide key={property.id}>
                <Link
                  to={`/details/${property.id}`}
                  className="rounded-xl overflow-hidden bg-white border shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
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
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                      {property.title}
                    </h3>
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
                        <span className="font-bold">€{property.price}</span>
                        <span className="text-gray-500"> / night</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {items.length === 0 && !loading && (
          <p className="text-gray-500">No properties found.</p>
        )}
      </div>

      {/* Custom CSS për shigjetat */}
     <style jsx global>{`
  .swiper-button-next,
  .swiper-button-prev {
    color: #ef4444 !important; /* ngjyra e kuqe */
    width: 40px;
    height: 40px;
    top: 50% !important;
    transform: translateY(-50%);
  }


  /* Pikat e pagination */
  .swiper-pagination-bullet {
    background: #ef4444 !important; /* kuqe për pikat */
    opacity: 0.4;
  }

  .swiper-pagination-bullet-active {
    background: #ef4444 !important; /* kuqe për pikën aktive */
    opacity: 1;
  }
`}</style>
    </section>
  );
}
