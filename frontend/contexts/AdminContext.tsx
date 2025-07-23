'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { adminAuth } from '@/lib/admin-api'

interface AdminContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated on mount
    setIsAuthenticated(adminAuth.isAuthenticated())
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const success = await adminAuth.login(email, password)
    setIsAuthenticated(success)
    return success
  }

  const logout = () => {
    adminAuth.logout()
    setIsAuthenticated(false)
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}