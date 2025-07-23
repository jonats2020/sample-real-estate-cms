import express from 'express'
import { getPayload } from 'payload'
import { resolve, dirname } from 'path'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import payloadConfig from './payload.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config()

const start = async () => {
  const app = express()
  const PORT = Number(process.env.PORT) || 3000

  // Health check endpoints (available immediately)
  app.get('/', (req, res) => {
    res.status(200).json({ 
      status: 'healthy',
      message: 'Payload CMS API Server',
      admin: '/admin',
      api: '/api',
      timestamp: new Date().toISOString()
    })
  })
  
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' })
  })

  console.log('Starting Payload CMS server v3...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
  console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set')
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'Set' : 'Not set')
  console.log('DATABASE_PRIVATE_URL:', process.env.DATABASE_PRIVATE_URL ? 'Set' : 'Not set')
  console.log('All DB env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')))
  console.log('All env vars:', Object.keys(process.env).slice(0, 10))
  const dbConnection = process.env.DATABASE_URL || process.env.DATABASE_URI || process.env.POSTGRES_URL
  console.log('Using connection:', dbConnection ? 'Found' : 'None found')
  console.log('Connection starts with:', dbConnection ? dbConnection.substring(0, 50) + '...' : 'None')
  console.log('Connection includes railway.app:', dbConnection ? dbConnection.includes('railway.app') : false)
  
  try {
    // Initialize Payload
    console.log('Initializing Payload...')
    const payload = await getPayload({
      config: payloadConfig
    })
    console.log('Payload initialized successfully!')

    // Static media files
    app.use('/media', express.static(resolve(__dirname, '../media')))

    // Admin panel route
    app.get('/admin', async (req, res) => {
      res.status(200).json({
        message: 'Payload v3 Admin Panel',
        note: 'Admin panel requires Next.js integration in v3',
        api_endpoints: ['/api/properties', '/api/properties/:slug']
      })
    })

    // Database reset endpoint - drops and recreates properties table
    app.post('/api/reset-db', async (req, res) => {
      try {
        console.log('Resetting database schema...')
        
        // Force drop the properties table and recreate it
        // This will force Payload to recreate the table with new schema
        await payload.db.drizzle.execute(`DROP TABLE IF EXISTS properties CASCADE;`)
        await payload.db.drizzle.execute(`DROP TABLE IF EXISTS properties_rels CASCADE;`)
        
        // Restart Payload to recreate tables with new schema
        console.log('Tables dropped, Payload will recreate on next operation')
        
        res.status(200).json({ 
          message: 'Database reset successful - tables will be recreated with new schema' 
        })
      } catch (error) {
        console.error('Database reset error:', error)
        res.status(500).json({ error: 'Failed to reset database' })
      }
    })

    // Seed endpoint for manual database reset
    app.post('/api/seed', async (req, res) => {
      try {
        console.log('Starting manual database seed...')
        
        // Clear existing properties
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
        
        // Create new properties with images
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
          await payload.create({
            collection: 'properties',
            data: property,
          })
        }

        res.status(200).json({ 
          message: 'Database reseeded successfully',
          created: properties.length 
        })
      } catch (error) {
        console.error('Seed endpoint error:', error)
        res.status(500).json({ error: 'Failed to seed database' })
      }
    })

    // Add CORS middleware
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
      }
      next()
    })

    // Add JSON middleware
    app.use(express.json())

    // API routes - handle through Local API
    
    // Get all properties (admin - includes unpublished)
    app.get('/api/properties', async (req, res) => {
      try {
        const isAdmin = req.query.admin === 'true'
        const whereClause = isAdmin ? {} : { isPublished: { equals: true } }
        
        const result = await payload.find({
          collection: 'properties',
          where: whereClause
        })
        res.json(result)
      } catch (error) {
        console.error('Error fetching properties:', error)
        res.status(500).json({ error: 'Failed to fetch properties' })
      }
    })

    // Get single property by slug (public)
    app.get('/api/properties/:slug', async (req, res) => {
      try {
        const isNumericId = /^\d+$/.test(req.params.slug)
        
        let result
        if (isNumericId) {
          // Get by ID
          result = await payload.findByID({
            collection: 'properties',
            id: parseInt(req.params.slug)
          })
          res.json(result)
        } else {
          // Get by slug
          result = await payload.find({
            collection: 'properties',
            where: {
              slug: { equals: req.params.slug },
              isPublished: { equals: true }
            }
          })
          if (result.docs.length > 0) {
            res.json(result.docs[0])
          } else {
            res.status(404).json({ error: 'Property not found' })
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        res.status(500).json({ error: 'Failed to fetch property' })
      }
    })

    // Create property (admin)
    app.post('/api/properties', async (req, res) => {
      try {
        const result = await payload.create({
          collection: 'properties',
          data: req.body
        })
        res.status(201).json(result)
      } catch (error) {
        console.error('Error creating property:', error)
        res.status(500).json({ error: 'Failed to create property' })
      }
    })

    // Update property (admin)
    app.patch('/api/properties/:id', async (req, res) => {
      try {
        const result = await payload.update({
          collection: 'properties',
          id: parseInt(req.params.id),
          data: req.body
        })
        res.json(result)
      } catch (error) {
        console.error('Error updating property:', error)
        res.status(500).json({ error: 'Failed to update property' })
      }
    })

    // Delete property (admin)
    app.delete('/api/properties/:id', async (req, res) => {
      try {
        await payload.delete({
          collection: 'properties',
          id: parseInt(req.params.id)
        })
        res.status(200).json({ message: 'Property deleted successfully' })
      } catch (error) {
        console.error('Error deleting property:', error)
        res.status(500).json({ error: 'Failed to delete property' })
      }
    })

  } catch (error) {
    console.error('Failed to initialize Payload:', error)
    
    // Fallback routes if Payload fails
    app.get('/api/*', (req, res) => {
      res.status(503).json({ 
        error: 'Payload CMS initialization failed',
        message: 'Database connection or configuration issue'
      })
    })
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/`)
    console.log(`API available at: http://localhost:${PORT}/api`)
  })
}

start().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})