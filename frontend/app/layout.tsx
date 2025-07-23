import type { Metadata } from 'next'
import './globals.css'
import { AdminProvider } from '@/contexts/AdminContext'
import AdminProfile from '@/components/AdminProfile'

export const metadata: Metadata = {
  title: 'Real Estate Listings',
  description: 'Find your dream property',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Header with admin profile */}
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Real Estate Listings</h1>
                  </div>
                  <AdminProfile />
                </div>
              </div>
            </header>
            
            {/* Main content */}
            <main>
              {children}
            </main>
          </div>
        </AdminProvider>
      </body>
    </html>
  )
}
