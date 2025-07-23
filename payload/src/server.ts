import express from 'express'
import payload from 'payload'
import { resolve, dirname } from 'path'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import payloadConfig from './payload.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config()

const app = express()

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
    express: app,
    config: payloadConfig,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.use('/media', express.static(resolve(__dirname, '../media')))

  const PORT = process.env.PORT || 3000

  app.listen(PORT, async () => {
    payload.logger.info(`Server listening on port ${PORT}`)
  })
}

start()