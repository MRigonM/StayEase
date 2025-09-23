"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "https://localhost:5000/api/Property/GetProperties";

const Explore = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [aiQuery, setAiQuery] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("ratingDesc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

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

  // Apply filters, search, sorting
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === typeFilter.toLowerCase())
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    switch (sortBy) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "ratingAsc":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "ratingDesc":
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [items, search, locationFilter, typeFilter, minPrice, maxPrice, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

 


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="relative h-[33vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <img
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
              alt="Beautiful property"
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl mb-8">
            From cozy apartments to luxury villas, discover properties that match your lifestyle anywhere in the world.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 -mt-16 relative z-10">
        <div className="bg-white shadow-xl rounded-3xl p-8">
          <div className="grid md:grid-cols-6 sm:grid-cols-2 gap-4">

            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full bg-transparent outline-none placeholder-gray-400 text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
              />
            </div>

            <input
                type="text"
                placeholder="Location"
                className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition placeholder-gray-400 text-sm"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(1);
                }}
            />

            <input
                type="text"
                placeholder="Type (e.g., Villa)"
                className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition placeholder-gray-400 text-sm"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
            />

            <input
                type="number"
                placeholder="Min Price"
                className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition placeholder-gray-400 text-sm"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
            />

            <input
                type="number"
                placeholder="Max Price"
                className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition placeholder-gray-400 text-sm"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
            />

            <select
                className="border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ratingDesc">Top Rated</option>
              <option value="ratingAsc">Lowest Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>


      <main className="flex-1 container mx-auto px-4 py-12">
        {loading && <p className="text-gray-500">Loading properties…</p>}
        {err && <p className="text-red-600">Error: {err}</p>}

        {!loading && !err && (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedItems.map((property) => (
                <Link
                  to={`/details/${property.id}`}
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-2 border rounded disabled:opacity-50 bg-white hover:bg-gray-100"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-2 border rounded ${
                      page === i + 1
                        ? "bg-teal-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-2 border rounded disabled:opacity-50 bg-white hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {items.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-8">No properties found.</p>
        )}
      </main>

      <footer className="bg-gray-100 py-6 mt-12 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} StayEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Explore;
