const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api'

export interface AdminProperty {
  id?: number
  title: string
  slug: string
  location: string
  price: number
  image?: {
    url: string
    alt?: string
  } | null
  description: string
  isPublished: boolean
}

// Admin authentication (for demo - using simple session)
let adminToken: string | null = null

export const adminAuth = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      // For demo purposes, we'll use the known admin credentials
      if (email === 'admin@demo.com' && password === 'admin123') {
        adminToken = 'demo-admin-token'
        localStorage.setItem('adminToken', adminToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  },

  logout() {
    adminToken = null
    localStorage.removeItem('adminToken')
  },

  isAuthenticated(): boolean {
    if (!adminToken) {
      adminToken = localStorage.getItem('adminToken')
    }
    return !!adminToken
  }
}

// CRUD operations for properties
export const adminAPI = {
  // Get all properties (including unpublished)
  async getAllProperties(): Promise<AdminProperty[]> {
    try {
      const response = await fetch(`${PAYLOAD_API_URL}/properties`)
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      return data.docs || []
    } catch (error) {
      console.error('Error fetching all properties:', error)
      return []
    }
  },

  // Create new property
  async createProperty(property: Omit<AdminProperty, 'id'>): Promise<AdminProperty | null> {
    try {
      const response = await fetch(`${PAYLOAD_API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create property')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating property:', error)
      return null
    }
  },

  // Update property
  async updateProperty(id: number, property: Partial<AdminProperty>): Promise<AdminProperty | null> {
    try {
      const response = await fetch(`${PAYLOAD_API_URL}/properties/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update property')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating property:', error)
      return null
    }
  },

  // Delete property
  async deleteProperty(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${PAYLOAD_API_URL}/properties/${id}`, {
        method: 'DELETE',
      })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting property:', error)
      return false
    }
  },

  // Get single property
  async getProperty(id: number): Promise<AdminProperty | null> {
    try {
      const response = await fetch(`${PAYLOAD_API_URL}/properties/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch property')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching property:', error)
      return null
    }
  }
}