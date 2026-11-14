import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center font-heading uppercase tracking-wider font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-sm',
  md: 'px-5 py-2.5 text-sm rounded-sm',
  lg: 'px-7 py-3 text-base rounded-sm',
}

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-500 shadow-sm active:translate-y-px',
  secondary: 'bg-navy-900 hover:bg-navy-950 text-white focus-visible:ring-navy-900 shadow-sm active:translate-y-px',
  outline: 'border border-line hover:border-navy-900 text-ink hover:bg-mist focus-visible:ring-navy-800',
  danger: 'bg-rejected hover:bg-red-700 text-white focus-visible:ring-red-500 shadow-sm active:translate-y-px',
  ghost: 'text-muted hover:text-ink hover:bg-mist',
  light: 'bg-white hover:bg-brand-500 text-navy-950 hover:text-white',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  to,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled || loading} className={cls} {...props}>
      {loading && <span className="mr-2 w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  )
}
 /* test is for this */ 