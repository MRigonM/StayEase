import { useState } from "react";
import { Check, Copy, Share2, Calendar, Home } from "lucide-react";

export default function SuccessModal({ onClose, propertyData }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText("https://stayease.com/property/123456");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const propertyId = Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md md:max-w-xl w-full p-8">
        {/* Dialog Header */}
        <div className="flex justify-center items-center gap-2 text-2xl font-bold mb-6">
          <div className="bg-green-100 p-2 rounded-full">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          Property Listed Successfully!
        </div>

        <div className="py-6">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-200 rounded-lg w-24 h-24 flex-shrink-0 overflow-hidden">
                {propertyData.images && propertyData.images.length > 0 ? (
                  <img
                    src={propertyData.images[0].preview || "/placeholder.svg"}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  {propertyData.propertyDetails?.title || "Your New Property"}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {propertyData.propertyDetails?.propertyType || "Home"} · ID:{" "}
                  {propertyId}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Active
                  </span>
                  <span className="text-gray-500">Listed just now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Share Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Your calendar is ready</span>
              </div>
              <button className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700">
                Manage Calendar
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Share your listing</span>
              </div>
              <button
                className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
                onClick={copyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="sm:flex-1 border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700"
          >
            Close
          </button>
          <button className="sm:flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
            View Your Listing
          </button>
        </div>
      </div>
    </div>
  );
}
