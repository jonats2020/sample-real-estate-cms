import { getProperty } from '@/lib/api'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getProperty(slug)
  
  if (!property) {
    notFound()
  }

  const imageUrl = property.imageUrl || '/placeholder.jpg'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{property.title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-xl text-gray-600">{property.location}</p>
              <p className="text-3xl font-bold text-blue-600">
                ${property.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}