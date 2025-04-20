import React from "react";

export function BecomeHost() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become a StayEase Host
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Turn your extra space into extra income. Join thousands of hosts who
            are earning by sharing their homes on StayEase.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="block bg-white text-black font-medium text-lg px-6 py-3 rounded-lg hover:bg-gray-100 text-center"
            >
              Start Hosting
            </a>
            <a
              href="#"
              className="block border border-white text-white font-medium text-lg px-6 py-3 rounded-lg hover:bg-white/10 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
