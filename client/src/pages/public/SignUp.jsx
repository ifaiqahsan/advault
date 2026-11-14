import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Input from '../../components/ui/Input'
import RoleToggle from '../../components/ui/RoleToggle'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const fromLoc = useLocation().state?.from
  const from = fromLoc ? `${fromLoc.pathname}${fromLoc.search || ''}` : null

  const [role, setRole] = useState('sponsor')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = register({ ...form, role })
    if (!result.ok) return setFormError(result.error)
    navigate(role === 'creator' ? '/creator/profile' : from || '/creators', { replace: true })
  }

  return (
    <AuthShell title="Sign Up" subtitle="Create your account and pick how you will use AdVault.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <RoleToggle value={role} onChange={setRole} />

        <Input name="name" label="Full Name" required autoComplete="name" value={form.name} onChange={update('name')} error={errors.name} />
        <Input name="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} error={errors.email} />
        <Input name="password" label="Password" type="password" required autoComplete="new-password" value={form.password} onChange={update('password')} error={errors.password} />
        <Input name="confirm" label="Confirm Password" type="password" required autoComplete="new-password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />

        {formError && <p className="text-rejected text-sm fade-in">{formError}</p>}

        <Button type="submit" size="lg" className="w-full">
          Create {role === 'creator' ? 'Creator' : 'Sponsor'} Account
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already registered? <Link to="/login" className="text-brand-500 font-semibold hover:underline">Log In</Link>
      </p>
    </AuthShell>
  )
}
