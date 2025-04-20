"use client";

import React, { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// Dummy data for featured properties WILL BECOME DYNAMIC SOON
const featuredProperties = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Malibu, California",
    price: 350,
    rating: 4.9,
    reviews: 128,
    image: "https://placehold.co/600x400/png",
    tags: ["Beachfront", "Pool"],
  },
  {
    id: 2,
    title: "Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 275,
    rating: 4.8,
    reviews: 96,
    image: "https://placehold.co/600x400/png",
    tags: ["Mountain View", "Hot Tub"],
  },
  {
    id: 3,
    title: "Downtown Luxury Loft",
    location: "New York City, NY",
    price: 225,
    rating: 4.7,
    reviews: 84,
    image: "https://placehold.co/600x400/png",
    tags: ["City View", "Modern"],
  },
  {
    id: 4,
    title: "Lakeside Cottage",
    location: "Lake Tahoe, Nevada",
    price: 195,
    rating: 4.8,
    reviews: 72,
    image: "https://placehold.co/600x400/png",
    tags: ["Lakefront", "Fireplace"],
  },
  {
    id: 5,
    title: "Historic Townhouse",
    location: "Charleston, SC",
    price: 210,
    rating: 4.9,
    reviews: 65,
    image: "https://placehold.co/600x400/png",
    tags: ["Historic", "Garden"],
  },
  {
    id: 6,
    title: "Oceanfront Condo",
    location: "Miami Beach, Florida",
    price: 240,
    rating: 4.7,
    reviews: 91,
    image: "https://placehold.co/600x400/png",
    tags: ["Ocean View", "Pool"],
  },
];

export function FeaturedProperties() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Discover our most popular vacation rentals
            </p>
          </div>

          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 border rounded-full ${
                !canScrollLeft
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Scroll left</span>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 border rounded-full ${
                !canScrollRight
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Scroll right</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-6 -mx-4 px-4 scrollbar-hide"
          onScroll={checkScrollButtons}
        >
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              className="min-w-[300px] max-w-[300px] rounded-xl overflow-hidden flex-shrink-0 hover:shadow-lg transition-shadow border"
            >
              <div className="relative h-[200px] w-full">
                <img
                  src={property.image || "https://placehold.co/600x400/png"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-white/80 text-black rounded hover:bg-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1 text-teal-600" />
                  {property.location}
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-1">
                  {property.title}
                </h3>
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
        </div>

        <div className="text-center mt-8">
          <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
}
