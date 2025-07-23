import { getProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import HeroSection from '@/components/HeroSection'; // New component

export default async function Home() {
  // In a real application, you'd likely pass filter parameters
  // to getProperties and handle pagination logic here.
  const properties = await getProperties();

  return (
    <div className="bg-gray-50 min-h-screen"> {/* Lighter background for the whole page */}
      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Discover Your Dream Home
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Explore a wide range of properties tailored to your needs.
          </p>
        </div>

        {/* Property Listings */}
        <div className="mt-10">
          {properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-xl font-medium">
                No properties available at the moment.
              </p>
              <p className="text-gray-500 mt-3">
                We&apos;re constantly updating our listings, please check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}