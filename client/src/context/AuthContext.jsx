import { createContext, useContext, useState } from 'react'
import { seedUsers } from '../data/mockUsers'

export const defaultMockCreator = {
  id: 'creator-1',
  creatorId: 'creator-1',
  name: 'TechBytes Weekly',
  email: 'sarah@techbytes.dev',
  role: 'creator',
  type: 'newsletter',
  bio: 'Curated weekly breakdown of developer tooling, open source projects, and software engineering architecture.',
  audienceSize: 45000,
  website: 'https://techbytes.dev',
  social: {
    twitter: 'https://x.com/techbytes',
    linkedin: 'https://linkedin.com/company/techbytes',
  },
}

export const AuthContext = createContext(null)

const USERS_KEY = 'advault_users'
const SESSION_KEY = 'advault_user'

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION_KEY, null))

  const getUsers = () => read(USERS_KEY, seedUsers)

  const startSession = (account) => {
    const safe = { ...account }
    delete safe.password
    setUser(safe)
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    return safe
  }

  const login = (email, password, role) => {
    const account = getUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase())

    if (!account || account.password !== password) {
      return { ok: false, error: 'Incorrect email or password.' }
    }
    if (account.role !== role) {
      return { ok: false, error: `This email is registered as a ${account.role}. Switch the role above.` }
    }
    return { ok: true, user: startSession(account) }
  }

  const register = ({ name, email, password, role }) => {
    const users = getUsers()

    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    const account = { id: Date.now(), name: name.trim(), email: email.trim(), password, role }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, account]))
    return { ok: true, user: startSession(account) }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  const updateProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
