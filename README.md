# Real Estate Listing System

A full-stack real estate listing system built with Payload CMS (backend) and Next.js (frontend).

## Architecture

- **Backend**: Payload CMS with PostgreSQL (handles all API, admin panel, and database)
- **Frontend**: Next.js with TypeScript and TailwindCSS (displays properties)

## Quick Start

### 1. Deploy Backend to Railway

1. Push this code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project → Deploy from GitHub repo
4. Add PostgreSQL database in Railway
5. Set environment variables:
   ```
   DATABASE_URI=${{ Postgres.DATABASE_URL }}
   PAYLOAD_SECRET=your-very-long-random-secret-key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Deploy! Your admin panel will be at `https://sample-real-estate-cms-production.up.railway.app/admin`

### 2. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import the `frontend` folder
3. Set environment variables:
   ```
   NEXT_PUBLIC_PAYLOAD_API_URL=https://sample-real-estate-cms-production.up.railway.app/api
   NEXT_PUBLIC_PAYLOAD_URL=https://sample-real-estate-cms-production.up.railway.app
   ```
4. Deploy!

### 3. Create Admin User

Visit your Payload admin panel and create the first admin user.

### 4. Add Sample Data (Optional)

Run the seed script in your Railway app:
```bash
npm run seed
```

## Local Development

### Backend (Payload CMS)
```bash
cd payload
cp .env.example .env
# Update .env with your database credentials
npm install
npm run dev
```

### Frontend (Next.js)
```bash
cd frontend
cp .env.example .env.local
# Update .env.local with your API URLs
npm install
npm run dev
```

## Features

- Property listings with image uploads
- Rich text descriptions
- Auto-generated slugs
- Published/unpublished states
- Responsive frontend
- Property detail pages
- PostgreSQL database
- Ready for production deployment

## Project Structure

```
sample-real-estate-cms/
├── payload/              # Payload CMS Backend
│   ├── src/
│   │   ├── collections/  # Property & Media collections
│   │   ├── server.ts     # Express server
│   │   └── payload.config.ts
│   └── package.json
│
└── frontend/             # Next.js Frontend
    ├── app/              # App router pages
    ├── components/       # React components
    ├── lib/              # API utilities
    └── package.json
```