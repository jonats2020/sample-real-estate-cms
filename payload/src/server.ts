import { getPayload } from 'payload'
import config from './payload.config.js'

const start = async () => {
  const payload = await getPayload({ config })
  
  payload.logger.info('Payload CMS started successfully')
  payload.logger.info(`Admin URL: ${payload.getAdminURL()}`)
}

start().catch((error) => {
  console.error('Error starting Payload:', error)
  process.exit(1)
})