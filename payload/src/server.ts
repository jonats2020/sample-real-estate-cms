import express from 'express'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.get('/', (req, res) => {
  res.send('Payload CMS is running!')
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})