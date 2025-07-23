import { getPayload } from 'payload'
import { config } from 'dotenv'
import payloadConfig from './payload.config.js'

config()

const seed = async () => {
  const payload = await getPayload({
    config: payloadConfig
  })

  console.log('Creating admin user...')
  
  try {
    // Create admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@demo.com',
        password: 'admin123',
        name: 'Demo Admin',
      },
    })
    console.log('Admin user created:', adminUser.email)

    // Clear existing properties first
    console.log('Clearing existing properties...')
    const existingProperties = await payload.find({
      collection: 'properties',
      limit: 1000,
    })
    
    for (const property of existingProperties.docs) {
      await payload.delete({
        collection: 'properties',
        id: property.id,
      })
    }
    console.log(`Deleted ${existingProperties.docs.length} existing properties`)

    // Create sample properties with image URLs
    console.log('Creating sample properties...')
    
    const properties = [
      {
        title: 'Modern Downtown Apartment',
        slug: 'modern-downtown-apartment',
        location: 'Downtown District',
        price: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        description: 'Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.',
        isPublished: true,
      },
      {
        title: 'Suburban Family Home',
        slug: 'suburban-family-home', 
        location: 'Green Valley',
        price: 750000,
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        description: 'Spacious family home in quiet neighborhood with large backyard and excellent schools nearby.',
        isPublished: true,
      },
      {
        title: 'Luxury Beachfront Condo',
        slug: 'luxury-beachfront-condo',
        location: 'Coastal Paradise',
        price: 1200000,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        description: 'Exclusive beachfront condominium with ocean views and direct beach access.',
        isPublished: true,
      }
    ]

    for (const property of properties) {
      const created = await payload.create({
        collection: 'properties',
        data: property,
      })
      console.log('Created property:', created.title)
    }

    console.log('Seeding completed!')

  } catch (error) {
    console.error('Seeding failed:', error)
  }

  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed script failed:', error)
  process.exit(1)
})