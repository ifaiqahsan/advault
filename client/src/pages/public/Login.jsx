import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Input from '../../components/ui/Input'
import RoleToggle from '../../components/ui/RoleToggle'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

const destination = (role, from) => (role === 'creator' ? '/creator/dashboard' : from || '/sponsor/dashboard')

export default function LogIn() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const fromLoc = useLocation().state?.from
  const from = fromLoc ? `${fromLoc.pathname}${fromLoc.search || ''}` : null

  const [role, setRole] = useState('sponsor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  if (user) return <Navigate to={destination(user.role, from)} replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password, role)
    if (!result.ok) {
      setInfo('')
      return setError(result.error)
    }
    navigate(destination(role, from), { replace: true })
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

        <Input name="email" label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input name="password" label="Password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={fillDemo} className="text-muted hover:text-brand-500 transition">
            Fill demo {role} account
          </button>
          <button
            type="button"
            onClick={() => setInfo('Password reset arrives with the backend. Use the demo account for now.')}
            className="text-brand-500 font-semibold hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {error && <p className="text-rejected text-sm fade-in">{error}</p>}
        {info && <p className="text-revision text-sm fade-in">{info}</p>}

        <Button type="submit" size="lg" className="w-full">Log In</Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        New to AdVault? <Link to="/register" className="text-brand-500 font-semibold hover:underline">Sign Up</Link>
      </p>
    </AuthShell>
  )
}
