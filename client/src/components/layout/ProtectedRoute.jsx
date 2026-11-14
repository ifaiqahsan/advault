import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const homeFor = { creator: '/creator/dashboard', sponsor: '/sponsor/dashboard' }

export default function ProtectedRoute({ role }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (user.role !== role) return <Navigate to={homeFor[user.role] || '/'} replace />

  return <Outlet />
}
