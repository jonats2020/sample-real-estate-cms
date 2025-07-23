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

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' })
  })

  app.use('/media', express.static(resolve(__dirname, '../media')))

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Admin panel: http://localhost:${PORT}/admin`)
  })
}

start().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})