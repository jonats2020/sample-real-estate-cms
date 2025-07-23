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

  // Initialize Payload
  const payload = await getPayload({
    config: payloadConfig
  })

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' })
  })

  // Static media files
  app.use('/media', express.static(resolve(__dirname, '../media')))

  // Admin panel route
  app.get('/admin*', async (req, res) => {
    // For Payload v3, we need to handle admin differently
    // This is a temporary solution - ideally we'd use Next.js
    res.redirect('https://sample-real-estate-cms-production.up.railway.app/admin')
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API available at: http://localhost:${PORT}/api`)
    console.log(`Note: Admin panel requires Next.js setup for Payload v3`)
  })
}

start().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})