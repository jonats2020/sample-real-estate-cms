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

    // API routes - handle through Local API
    app.get('/api/properties', async (req, res) => {
      try {
        const result = await payload.find({
          collection: 'properties',
          where: {
            isPublished: { equals: true }
          }
        })
        res.json(result)
      } catch (error) {
        console.error('Error fetching properties:', error)
        res.status(500).json({ error: 'Failed to fetch properties' })
      }
    })

    app.get('/api/properties/:slug', async (req, res) => {
      try {
        const result = await payload.find({
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
      } catch (error) {
        console.error('Error fetching property:', error)
        res.status(500).json({ error: 'Failed to fetch property' })
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