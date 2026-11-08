import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Input from '../../components/ui/Input'
import RoleToggle from '../../components/ui/RoleToggle'
import { useAuth } from '../../context/AuthContext'

const home = (role, from) => (role === 'creator' ? '/creator/dashboard' : from || '/creators')

export default function LogIn() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from?.pathname

  const [role, setRole] = useState('sponsor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to={home(user.role, from)} replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password, role)
    if (!result.ok) return setError(result.error)
    navigate(home(role, from), { replace: true })
  }

  const fillDemo = () => {
    setEmail(`${role}@advault.com`)
    setPassword(`${role}123`)
    setError('')
  }

  return (
    <AuthShell title="Log In" subtitle="Welcome back. Choose your role to continue.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <RoleToggle value={role} onChange={setRole} />

        <Input id="email" label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" label="Password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="text-rejected text-sm">{error}</p>}

        <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider text-lg py-3 transition">
          Log In
        </button>

        <button type="button" onClick={fillDemo} className="w-full text-sm text-muted hover:text-brand-500 transition">
          Fill demo {role} account
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        New to AdVault?{' '}
        <Link to="/register" className="text-brand-500 font-semibold hover:underline">Sign Up</Link>
      </p>
    </AuthShell>
  )
}