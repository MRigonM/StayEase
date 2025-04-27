import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyForm from "../../components/host/property-form";
import CalendarSection from "../../components/host/calendar-section";
import ImageUpload from "../../components/host/image-upload";
import MapSection from "../../components/host/map-section";
import SuccessModal from "../../components/host/success-modal";
import Navbar from "../../components/Navbar";

function HostAHousePage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    propertyDetails: {},
    pricing: {},
    availability: {},
    images: [],
    location: {},
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowSuccess(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateFormData = (section, data) => {
    setFormData({
      ...formData,
      [section]: data,
    });
  };

  const fadeIn = {
    opacity: 0,
    transform: "translateY(20px)",
    transition: "opacity 0.6s, transform 0.6s",
  };

  const fadeInVisible = {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 0.6s, transform 0.6s",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
        <img
          src="https://placehold.co/1080x1920"
          alt="Beautiful property"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                {step === 1 && "Property Details"}
                {step === 2 && "Pricing & Availability"}
                {step === 3 && "Upload Photos"}
                {step === 4 && "Location & Finalize"}
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                Step {step} of {totalSteps}
              </div>
            </div>
            <div className="h-2 bg-gray-100">
              <div
                className="bg-green-600"
                style={{ width: `${progress}%`, height: "100%" }}
              ></div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div style={step === 1 ? fadeInVisible : fadeIn}>
              {step === 1 && (
                <PropertyForm
                  initialData={formData.propertyDetails}
                  updateData={(data) => updateFormData("propertyDetails", data)}
                />
              )}
            </div>
            <div style={step === 2 ? fadeInVisible : fadeIn}>
              {step === 2 && (
                <CalendarSection
                  initialData={formData.availability}
                  updateData={(data) => updateFormData("availability", data)}
                />
              )}
            </div>
            <div style={step === 3 ? fadeInVisible : fadeIn}>
              {step === 3 && (
                <ImageUpload
                  initialImages={formData.images}
                  updateImages={(images) => updateFormData("images", images)}
                />
              )}
            </div>
            <div style={step === 4 ? fadeInVisible : fadeIn}>
              {step === 4 && (
                <MapSection
                  initialData={formData.location}
                  updateData={(data) => updateFormData("location", data)}
                />
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-between">
            <div className="flex items-center gap-2">
              {/* Conditionally render the Back button only if step !== 1 */}
              {step !== 1 && (
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="flex items-center gap-2 text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                Save Draft
              </button>

              <button
                onClick={handleNext}
                className={`flex items-center gap-2 ${
                  step === totalSteps
                    ? "text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    : "text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                }`}
              >
                {step === totalSteps ? "List Property" : "Continue"}
                {step !== totalSteps && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          onClose={() => setShowSuccess(false)}
          propertyData={formData}
        />
      )}
    </div>
  );
}

export default HostAHousePage;
