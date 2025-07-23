import { getProperties } from '@/lib/api'
import PropertyCard from '@/components/PropertyCard'

export default async function Home() {
  const properties = await getProperties()

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Featured Properties
        </h2>
        <p className="text-gray-600 mt-2">Discover your dream home today</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No properties available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
