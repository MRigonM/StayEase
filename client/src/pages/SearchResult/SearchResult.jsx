import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { MapPin, Star } from 'lucide-react';
import { Footer } from '../../components/footer';

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

const SearchResult = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
  
    return (
        <>
        <Navbar />
      <div className="flex h-screen">
        {/* Left Side - Properties */}
        <div className="w-1/2 p-6 bg-white overflow-x-auto">
  <h2 className="text-2xl font-bold mb-4">
    Results for: <span className="text-blue-600">{query}</span>
  </h2>

  <div className="grid grid-cols-3 gap-4">
    {featuredProperties.map((property) => (
      <Link
        to="/propertyDetail"
        key={property.id}
        className="w-[220px] rounded-xl overflow-hidden flex-shrink-0 hover:shadow-lg transition-shadow border"
      >
        <div className="relative h-[140px] w-full">
          <img
            src={property.image || "https://placehold.co/600x400/png"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {property.tags.map((tag, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 text-[10px] font-medium bg-white/80 text-black rounded hover:bg-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <MapPin className="h-3 w-3 mr-1 text-teal-600" />
            {property.location}
          </div>
          <h3 className="font-semibold text-base mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{property.rating}</span>
              <span className="text-gray-500 ml-1">
                ({property.reviews})
              </span>
            </div>
            <div>
              <span className="font-bold">${property.price}</span>
              <span className="text-gray-500 text-xs"> / night</span>
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>

  
        {/* Right Side - Embedded Google Map */}
        <div className="w-1/2 h-full">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47349.24919771726!2d20.877246675582607!3d42.602635130657135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549e2c417c62d5%3A0xc68a393d0f64c244!2sKosovo!5e0!3m2!1sen!2s!4v1680273918351!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kosovo Map"
          ></iframe>
        </div>
      </div>
      <Footer/>
      </>
    );
}

export default SearchResult
