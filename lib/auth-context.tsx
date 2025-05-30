"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  plan: "free" | "starter" | "pro" | "business" | "enterprise"
  usage: {
    current: number
    limit: number
  }
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // In a real app, validate token with backend
        const userData = localStorage.getItem("user_data")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock validation
      if (email === "demo@pdfmaster.com" && password === "demo123") {
        const userData: User = {
          id: "1",
          email,
          name: "Demo User",
          plan: "pro",
          usage: {
            current: 45.7,
            limit: 10240,
          },
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        }

        setUser(userData)
        localStorage.setItem("auth_token", "demo_token_123")
        localStorage.setItem("user_data", JSON.stringify(userData))

        return { success: true }
      } else {
        return { success: false, error: "Invalid email or password" }
      }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user creation
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        plan: "free",
        usage: {
          current: 0,
          limit: 200,
        },
      }

      setUser(userData)
      localStorage.setItem("auth_token", `token_${Date.now()}`)
      localStorage.setItem("user_data", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Signup failed. Please try again." }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user_data", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        updateUser,
      }}
    >
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
