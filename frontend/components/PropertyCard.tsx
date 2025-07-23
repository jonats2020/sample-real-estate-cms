import Image from 'next/image'
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
    <Link href={`/property/${property.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={fullImageUrl}
            alt={property.image?.alt || property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">{property.title}</h2>
          <p className="text-gray-600 mb-2">{property.location}</p>
          <p className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}