import { Search, Calendar, Home } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            StayEase makes finding and booking your perfect vacation rental simple and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Browse listings</h3>
            <p className="text-gray-600 text-center">
              Search through thousands of verified properties in your desired location with our easy-to-use filters.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Book your stay</h3>
            <p className="text-gray-600 text-center">
              Select your dates, confirm your booking details, and secure your reservation with our safe payment system.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Host your space</h3>
            <p className="text-gray-600 text-center">
              List your property, set your own schedule and prices, and start earning with our supportive hosting tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
