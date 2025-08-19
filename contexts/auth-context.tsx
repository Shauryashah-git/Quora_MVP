"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"
import { mockUsers } from "@/lib/mock-data"
import { hashPassword, verifyPassword } from "@/lib/password"
import { validateEmail, validatePassword, validateName } from "@/lib/validation"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (profileData: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("quora-user")
    if (storedUser) setUser(JSON.parse(storedUser))
    setIsLoading(false)
  }, [])

  const loadStoredUsers = (): any[] => {
    try {
      const raw = localStorage.getItem("quora-users")
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  const persistUsers = (users: any[]) => {
    localStorage.setItem("quora-users", JSON.stringify(users))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Basic validation
      if (!validateEmail(email).isValid || !password) return false
      // Check in stored users first, then mockUsers fallback (legacy)
      const stored = loadStoredUsers()
      const record = stored.find((u: any) => u.email === email)
      if (record) {
        const ok = await verifyPassword(password, record.passHash)
        if (!ok) return false
        const { passHash, ...clean } = record
        setUser(clean)
        localStorage.setItem("quora-user", JSON.stringify(clean))
        return true
      }
      // Legacy mock login support (password must be "password")
      const legacy = mockUsers.find((u) => u.email === email)
      if (legacy && password === "password") {
        setUser(legacy)
        localStorage.setItem("quora-user", JSON.stringify(legacy))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const nameVal = validateName(name)
      const emailVal = validateEmail(email)
      const passVal = validatePassword(password)
      if (!nameVal.isValid || !emailVal.isValid || !passVal.isValid) return false
      const users = loadStoredUsers()
      if (users.some((u) => u.email === email) || mockUsers.some((u) => u.email === email)) return false
      const passHash = await hashPassword(password)
      const record = { id: Date.now().toString(), name, email, passHash, reputation: 0, createdAt: new Date().toISOString() }
      users.push(record)
      persistUsers(users)
      const { passHash: _, ...clean } = record
      setUser(clean as User)
      localStorage.setItem("quora-user", JSON.stringify(clean))
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = (profileData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...profileData }
      setUser(updated)
      localStorage.setItem("quora-user", JSON.stringify(updated))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("quora-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
