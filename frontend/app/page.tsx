import { getProperties } from '@/lib/api';
import PropertyListing from '@/components/PropertyListing';
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

        {/* Property Listings with Filtering and Pagination */}
        <div className="mt-10">
          <PropertyListing properties={properties} />
        </div>
      </div>
    </div>
  );
}