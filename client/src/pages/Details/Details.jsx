"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";

const API_URL = "https://localhost:5000/api/Property/GetProperties";

const Details = () => {
  const { id } = useParams(); // e merr id nga URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
        const json = await res.json();

        // Gjej pronën me id
        const selected = json.data.find((_, idx) => String(idx) === id);
        setProperty(selected);
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!property) return <p className="p-6 text-red-500">Property not found.</p>;

  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <Link to="/explore" className="text-teal-600 hover:underline mb-4 inline-block">
        ← Back to Explore
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={
              property.imageUrls && property.imageUrls.length > 0
                ? `https://localhost:5000/${property.imageUrls[0]}`
                : "https://placehold.co/600x400/png"
            }
            alt={property.name}
            className="w-full h-80 object-cover rounded-xl shadow"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <p className="text-gray-600 mb-4">{property.description}</p>

          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 mr-2 text-teal-600" />
            <span>{property.location?.name}, {property.country?.name}</span>
          </div>

          <div className="flex items-center mb-6">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">
              {property.reviews && property.reviews.length > 0
                ? (property.reviews.reduce((s, r) => s + r.stars, 0) / property.reviews.length).toFixed(1)
                : "No rating"}
            </span>
            <span className="text-gray-500 ml-2">
              ({property.reviews?.length || 0} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold text-teal-700 mb-6">
            ${property.nightPrice} <span className="text-gray-500 text-base">/ night</span>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="flex gap-2 flex-wrap">
              {property.categories?.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Room Services</h3>
            <ul className="list-disc list-inside text-gray-700">
              {property.roomServices?.map((s, i) => (
                <li key={i}>{s.description}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {property.reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {property.reviews.map((r, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{r.stars}</span>
                </div>
                <p className="text-gray-700 italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
  
};

export default Details;
