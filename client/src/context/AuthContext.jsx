import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../utils/api'

const AuthContext = createContext(null)
const SESSION_KEY = 'advault_user'

const readSession = () => {
  try {
    return getToken() ? JSON.parse(localStorage.getItem(SESSION_KEY)) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  const saveSession = (token, account) => {
    setToken(token)
    localStorage.setItem(SESSION_KEY, JSON.stringify(account))
    setUser(account)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  // On page load, ask the server if the saved token is still valid
  useEffect(() => {
    if (!getToken()) return
    api('/auth/me')
      .then(({ user: fresh }) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(fresh))
        setUser(fresh)
      })
      .catch((err) => {
        if (err.status === 401 || err.status === 404) logout() // token expired or user deleted
      })
  }, [])

  const login = async (email, password, role) => {
    try {
      const { token, user: account } = await api('/auth/login', { method: 'POST', body: { email, password } })
      if (account.role !== role) return { ok: false, error: `This email is registered as a ${account.role}. Switch the role above.` }
      saveSession(token, account)
      return { ok: true, user: account }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  const register = async ({ name, email, password, role }) => {
    try {
      const { token, user: account } = await api('/auth/register', { method: 'POST', body: { name, email, password, role } })
      saveSession(token, account)
      return { ok: true, user: account }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  const updateProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, role: user ? user.role : null, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
