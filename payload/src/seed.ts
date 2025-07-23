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

    // Create sample properties
    console.log('Creating sample properties...')
    
    const properties = [
      {
        title: 'Modern Downtown Apartment',
        slug: 'modern-downtown-apartment',
        location: 'Downtown District',
        price: 450000,
        description: 'Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.',
        isPublished: true,
      },
      {
        title: 'Suburban Family Home',
        slug: 'suburban-family-home', 
        location: 'Green Valley',
        price: 750000,
        description: 'Spacious family home in quiet neighborhood with large backyard and excellent schools nearby.',
        isPublished: true,
      },
      {
        title: 'Luxury Beachfront Condo',
        slug: 'luxury-beachfront-condo',
        location: 'Coastal Paradise',
        price: 1200000,
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