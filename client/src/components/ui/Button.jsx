export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-heading uppercase tracking-wider font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-sm',
    md: 'px-5 py-2.5 text-sm rounded-sm',
    lg: 'px-7 py-3 text-base rounded-sm',
  }

  const variantClasses = {
    primary:
      'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 shadow-sm active:translate-y-px',
    secondary:
      'bg-navy-900 hover:bg-navy-950 text-white focus:ring-navy-900 shadow-sm active:translate-y-px',
    outline:
      'border border-line hover:border-navy-900 text-ink hover:bg-mist focus:ring-navy-800',
    danger:
      'bg-rejected hover:bg-red-700 text-white focus:ring-red-500 shadow-sm active:translate-y-px',
    ghost:
      'text-muted hover:text-ink hover:bg-mist',
  }

  const finalClass = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.primary
  } ${className}`.trim()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClass}
      {...props}
    >
      {children}
    </button>
  )
}