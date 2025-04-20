import React from 'react'
import Navbar from '../../components/Navbar'
import { Star, Heart } from "lucide-react";
import { Footer } from '../../components/footer';

const PropertyDetail = () => {
  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-2 py-20">
        {/* Title + Location */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold">Modern Beachfront Villa</h1>
            <p className="text-gray-600">Miami Beach, Florida</p>
          </div>
          <Heart className="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>

        {/* Image Gallery - Full Width */}
        <div className="grid gap-4 mb-10">
          <div>
            <img
              className="h-[500px] w-full object-cover rounded-lg"
              src="https://cdnp.ues.bg/estates/watermark/423/13423/135477.jpg"
              alt="Featured"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
  <div>
    <img
      className="h-40 w-full object-cover rounded-lg"
      src="https://cdn.loggia.gr/lodgeContent/963afb364e061a824fcf40b5769c5452.jpg"
      alt="Gallery 1"
    />
  </div>
  <div>
    <img
      className="h-40 w-full object-cover rounded-lg"
      src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/187675285.jpg?k=d5c820c08ea528368df96ff2550deb427f0675d9faa5e5dacc2bd6471c3aae13&o=&hp=1"
      alt="Gallery 2"
    />
  </div>
  <div>
    <img
      className="h-40 w-full object-cover rounded-lg"
      src="https://cdnp.ues.bg/estates/watermark/423/13423/135485.jpg"
      alt="Gallery 3"
    />
  </div>
  <div>
    <img
      className="h-40 w-full object-cover rounded-lg"
      src="https://www.oliverstravels.com/uploads/tx_oliverstravels/tx_simply_dwellings/Villa-Lagomandra-Halkidiki-Olivers-Travels-1.jpg"
      alt="Gallery 4"
    />
  </div>
  <div>
    <img
      className="h-40 w-full object-cover rounded-lg"
      src="https://gohalkidiki.com/wp-content/uploads/2023/03/house1.jpg"
      alt="Gallery 5"
    />
  </div>
</div>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="md:col-span-2 space-y-6">
            {/* Host Info + Rating */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Hosted by Alex</p>
                <p className="text-gray-600">4 guests · 2 bedrooms · 2 beds · 2 baths</p>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star fill="currentColor" className="w-5 h-5" />
                <span className="text-gray-800 font-semibold">4.9</span>
                <span className="text-gray-500">(120 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                This stunning beachfront villa offers breathtaking ocean views, modern interiors, and a private pool. It's a perfect getaway for families or couples looking to relax by the sea.
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-2">What this place offers</h3>
              <ul className="grid grid-cols-2 gap-2 text-gray-700">
                <li>🏖 Beach access</li>
                <li>🏊 Private pool</li>
                <li>📶 Wi-Fi</li>
                <li>🅿️ Free parking</li>
                <li>🔥 BBQ grill</li>
                <li>☕ Coffee maker</li>
              </ul>
            </div>
          </div>

          {/* Booking Box */}
          <div className="border rounded-xl p-6 shadow-md space-y-4 h-fit sticky top-28">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold">
                $300 <span className="text-base font-normal text-gray-600">/ night</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star fill="currentColor" className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-800">4.9</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="border p-2 rounded-md w-full" />
              <input type="date" className="border p-2 rounded-md w-full" />
              <input
                type="number"
                min="1"
                placeholder="Guests"
                className="col-span-2 border p-2 rounded-md w-full"
              />
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg w-full font-semibold">
              Reserve
            </button>
            <p className="text-xs text-center text-gray-500">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
