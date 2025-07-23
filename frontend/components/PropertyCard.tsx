import Link from 'next/link'
import type { Property } from '@/lib/api'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.image?.sizes?.card?.url || property.image?.url || '/placeholder.jpg'
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'}${imageUrl}`

  return (
    <Link href={`/property/${property.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={fullImageUrl}
            alt={property.image?.alt || property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {property.location}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}