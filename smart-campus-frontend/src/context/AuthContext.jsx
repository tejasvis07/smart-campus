import { createContext, useContext, useState, useCallback } from 'react'
import { login as loginApi } from '../api/client'

const AuthContext = createContext(null)

const STORAGE_TOKEN_KEY = 'campus_jwt'
const STORAGE_USER_KEY = 'campus_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async ({ email, password, role }) => {
    setError('')
    setIsLoading(true)
    try {
      const { token, user: loggedInUser } = await loginApi({ email, password, role })
      localStorage.setItem(STORAGE_TOKEN_KEY, token)
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      return loggedInUser
    } catch (err) {
      setError(err.message || 'Something went wrong while signing in.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    localStorage.removeItem(STORAGE_USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
