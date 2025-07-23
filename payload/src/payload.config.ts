import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Properties } from './collections/Properties.js'
import { Media } from './collections/Media.js'
import { Users } from './collections/Users.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor({}),
  collections: [
    Users,
    Properties,
    Media,
  ],
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || process.env.POSTGRES_URL,
    },
    migrationDir: './src/migrations',
    prodMigrations: undefined,
  }),
  sharp,
  cors: [
    'http://localhost:3001',
    'https://localhost:3001',
    process.env.FRONTEND_URL || '',
    'https://sample-real-estate-hlju5m4bm-natsdevstudio.vercel.app',
  ].filter(Boolean),
})