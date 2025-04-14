/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logoColor: '#FF5A5F',  // Airbnb Primary Color
        babu: '#00A699',    // Secondary color
        arches: '#FC642D',   // CTA Color
        hof: '#484848',      // Text color
        foggy: '#767676',    // Subtle text color
      },
    },
  },
  plugins: [],
}