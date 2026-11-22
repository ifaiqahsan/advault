import { useState } from 'react'

export default function Input({
  label,
  name,
  type = 'text',
  as = 'input',
  rows = 3,
  error,
  helperText,
  required = false,
  className = '',
  children,
  ...props
}) {
  const [show, setShow] = useState(false)

  const field = `w-full px-3.5 py-2.5 text-sm bg-paper text-ink border rounded-sm transition focus:outline-none focus:ring-2 disabled:bg-mist disabled:cursor-not-allowed ${
    error
      ? 'border-rejected focus:ring-rejected/30 focus:border-rejected'
      : 'border-line hover:border-navy-800/40 focus:border-brand-500 focus:ring-brand-500/20'
  }`

  const isPassword = type === 'password'

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-ink/80">
          {label}
          {required && <span className="text-brand-500 ml-1">*</span>}
        </label>
      )}

      {as === 'textarea' && <textarea id={name} name={name} rows={rows} className={field} {...props} />}
      {as === 'select' && (
        <select id={name} name={name} className={field} {...props}>
          {children}
        </select>
      )}
      {as === 'input' && (
        <div className="relative">
          <input
            id={name}
            name={name}
            type={isPassword && show ? 'text' : type}
            className={`${field} ${isPassword ? 'pr-16' : ''}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-muted hover:text-brand-500 transition"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      )}

      {error ? (
        <p className="text-xs text-rejected font-medium fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  )
}
