const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api'

export interface Property {
  id: string
  title: string
  slug: string
  location: string
  price: number
  image: {
    url: string
    alt?: string
    sizes?: {
      thumbnail?: {
        url: string
      }
      card?: {
        url: string
      }
    }
  }
  description: unknown
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    slug: 'modern-downtown-apartment',
    location: 'Downtown District',
    price: 450000,
    image: {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      alt: 'Modern apartment'
    },
    description: 'Beautiful modern apartment in the heart of downtown',
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2', 
    title: 'Suburban Family Home',
    slug: 'suburban-family-home',
    location: 'Green Valley',
    price: 750000,
    image: {
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      alt: 'Family home'
    },
    description: 'Spacious family home in quiet neighborhood',
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    title: 'Luxury Beachfront Condo',
    slug: 'luxury-beachfront-condo', 
    location: 'Coastal Paradise',
    price: 1200000,
    image: {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      alt: 'Beachfront condo'
    },
    description: 'Exclusive beachfront condominium with ocean views',
    isPublished: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/properties?where[isPublished][equals]=true`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      console.log('API not available, using sample data')
      return sampleProperties
    }
    
    const data = await response.json()
    return data.docs && data.docs.length > 0 ? data.docs : sampleProperties
  } catch (error) {
    console.error('Error fetching properties, using sample data:', error)
    return sampleProperties
  }
}

export async function getProperty(slug: string): Promise<Property | null> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/properties?where[slug][equals]=${slug}&where[isPublished][equals]=true`,
      {
        next: { revalidate: 60 },
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch property')
    }
    
    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching property, using sample data:', error)
    return sampleProperties.find(p => p.slug === slug) || null
  }
}