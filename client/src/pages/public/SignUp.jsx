import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Input from '../../components/ui/Input'
import RoleToggle from '../../components/ui/RoleToggle'
import { useAuth } from '../../context/AuthContext'

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from?.pathname

  const [role, setRole] = useState('sponsor')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.name.trim().length < 2) return setError('Please enter your full name.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    const result = register({ ...form, role })
    if (!result.ok) return setError(result.error)

    navigate(role === 'creator' ? '/creator/profile' : from || '/creators', { replace: true })
  }

  return (
    <AuthShell title="Sign Up" subtitle="Create your account and pick how you will use AdVault.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <RoleToggle value={role} onChange={setRole} />

        <Input id="name" label="Full Name" required autoComplete="name" value={form.name} onChange={update('name')} />
        <Input id="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} />
        <Input id="password" label="Password" type="password" required autoComplete="new-password" value={form.password} onChange={update('password')} />
        <Input id="confirm" label="Confirm Password" type="password" required autoComplete="new-password" value={form.confirm} onChange={update('confirm')} />

        {error && <p className="text-rejected text-sm">{error}</p>}

        <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-heading uppercase tracking-wider text-lg py-3 transition">
          Create {role === 'creator' ? 'Creator' : 'Sponsor'} Account
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already registered?{' '}
        <Link to="/login" className="text-brand-500 font-semibold hover:underline">Log In</Link>
      </p>
    </AuthShell>
  )
}