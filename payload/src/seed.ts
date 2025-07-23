import payload from 'payload'
import { resolve } from 'path'
require('dotenv').config()

const seedData = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
    local: true,
  })

  // Create admin user
  const adminEmail = 'admin@example.com'
  const adminPassword = 'admin123'
  
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
      },
    })
    console.log(`Admin user created: ${adminEmail}`)
  } catch (error) {
    console.log('Admin user might already exist')
  }

  // Sample properties
  const properties = [
    {
      title: 'Modern Downtown Apartment',
      location: 'Downtown District',
      price: 450000,
      description: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Beautiful modern apartment in the heart of downtown. Features include high ceilings, hardwood floors, and stunning city views. Walking distance to restaurants, shops, and public transportation.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'This 2-bedroom, 2-bathroom unit offers 1,200 sq ft of luxury living space with an open floor plan perfect for entertaining.',
                },
              ],
            },
          ],
        },
      },
      isPublished: true,
    },
    {
      title: 'Suburban Family Home',
      location: 'Green Valley',
      price: 750000,
      description: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Spacious family home in a quiet suburban neighborhood. This 4-bedroom, 3-bathroom house features a large backyard, modern kitchen, and attached 2-car garage.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Located in an excellent school district with parks and shopping nearby. Perfect for families looking for space and comfort.',
                },
              ],
            },
          ],
        },
      },
      isPublished: true,
    },
    {
      title: 'Luxury Beachfront Condo',
      location: 'Coastal Paradise',
      price: 1200000,
      description: {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Exclusive beachfront condominium with panoramic ocean views. This 3-bedroom, 2.5-bathroom residence offers the ultimate in coastal luxury living.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Premium amenities include private beach access, infinity pool, fitness center, and 24-hour concierge service. Wake up to the sound of waves every morning!',
                },
              ],
            },
          ],
        },
      },
      isPublished: true,
    },
  ]

  // Create properties
  for (const property of properties) {
    try {
      const created = await payload.create({
        collection: 'properties',
        data: property,
      })
      console.log(`Property created: ${created.title}`)
    } catch (error) {
      console.error(`Error creating property: ${property.title}`, error)
    }
  }

  console.log('\nSeed completed!')
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`)
  process.exit(0)
}

seedData().catch(console.error)