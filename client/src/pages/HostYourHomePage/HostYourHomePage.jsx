import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";


export default function HostYourHomePage() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Host your home on Airbnb</h1>
          <p className="text-lg text-gray-600 mb-10">
            Share your space with travelers and earn money by becoming a host. 
            Let us help you get started today.
          </p>

          <div className="bg-gray-100 rounded-xl shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Property Title</label>
              <input
                type="text"
                placeholder="Cozy apartment in Prishtina"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price per Night (€)</label>
              <input
                type="number"
                placeholder="Enter price"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
              <textarea
                rows="4"
                placeholder="Tell guests what makes your place special"
                className="w-full p-3 border border-gray-300 rounded-lg"
              ></textarea>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Link to="/" className="text-gray-500 hover:underline">
                Cancel
              </Link>
              <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold">
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
