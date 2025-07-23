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
  description: any
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/properties?where[isPublished][equals]=true`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties')
    }
    
    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
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
      return null
    }
    
    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}