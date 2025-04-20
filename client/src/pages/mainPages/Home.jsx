import React from 'react'
import Navbar from '../../components/Navbar'
import { HowItWorks } from '../../components/how-it-works'
import { FeaturedProperties } from '../../components/featured-properties'
import { BecomeHost } from '../../components/become-host'
import { Testimonials } from '../../components/testimonials'
import { SearchBar } from '../../components/search-bar'
import { Footer } from '../../components/footer'
import { HeroSlider } from '../../components/hero-slider'
/* bahen import komponentat */
/*Kjo komponent (Home) bahet import ne app.js*/

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="relative h-[600px] md:h-[700px] lg:h-[800px]">
          <HeroSlider />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
              Find your next stay with StayEase
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
              Vacation rentals for every occasion. Trusted by thousands.
            </p>

            <div className="w-full max-w-4xl z-10">
              <SearchBar />
            </div>
          </div>
        </section>

        <HowItWorks />

        <FeaturedProperties />

        <BecomeHost />

        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}