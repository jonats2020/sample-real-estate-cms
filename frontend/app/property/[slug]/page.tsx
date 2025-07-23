import { getProperty } from '@/lib/api'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const property = await getProperty(params.slug)
  
  if (!property) {
    notFound()
  }

  const imageUrl = property.image?.url || '/placeholder.jpg'
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'}${imageUrl}`

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={fullImageUrl}
              alt={property.image?.alt || property.title}
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
            
            {property.description && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Description</h2>
                <div className="text-gray-700">
                  {typeof property.description === 'string' 
                    ? property.description 
                    : renderRichText(property.description)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function renderRichText(content: any): React.ReactNode {
  if (!content?.root?.children) return null
  
  return content.root.children.map((node: any, index: number) => {
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-4">
          {node.children?.map((child: any, childIndex: number) => {
            if (child.type === 'text') {
              return <span key={childIndex}>{child.text}</span>
            }
            return null
          })}
        </p>
      )
    }
    return null
  })
}