const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://sample-real-estate-cms-production.up.railway.app/api'

export interface Property {
  id: string
  title: string
  slug: string
  location: string
  price: number
  imageUrl?: string
  description: unknown
  isPublished: boolean
  createdAt: string
  updatedAt: string
}


export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/properties`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      console.error('API not available')
      return []
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
      `${PAYLOAD_API_URL}/properties/${slug}`,
      {
        next: { revalidate: 60 },
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch property')
    }
    
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}