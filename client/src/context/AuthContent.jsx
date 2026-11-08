import { createContext, useContext, useState } from 'react'

export const defaultMockCreator = {
  id: 'creator-1',
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

export const AuthContext = createContext({
  user: defaultMockCreator,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultMockCreator)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context || !context.user) {
    return {
      user: defaultMockCreator,
      login: () => {},
      logout: () => {},
      updateProfile: () => {},
    }
  }
  return context
}

export default AuthContext

