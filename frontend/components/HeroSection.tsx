import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative bg-gray-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&q=80"
          alt="Luxury modern home"
          fill
          style={{ objectFit: 'cover' }}
          quality={80}
          className="opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-transparent opacity-75"></div> {/* Gradient overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Find Your Perfect Place
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
          Explore thousands of homes, apartments, and properties for sale or rent. Your dream home awaits.
        </p>
        {/* Search Bar Placeholder - You'll implement this */}
        <div className="mt-10 max-w-xl mx-auto">
          <form className="sm:flex">
            <div className="min-w-0 flex-1">
              <label htmlFor="hero-search" className="sr-only">
                Search properties
              </label>
              <input
                id="hero-search"
                type="search"
                placeholder="Enter location, property type, or keywords..."
                className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-600 text-base font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-10"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}