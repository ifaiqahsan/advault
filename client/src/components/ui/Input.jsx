export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  helperText,
  required = false,
  as = 'input',
  rows = 3,
  className = '',
  disabled = false,
  ...props
}) {
  const Component = as === 'textarea' ? 'textarea' : 'input'

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-semibold uppercase tracking-wider text-ink/80 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-brand-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <Component
        id={name}
        name={name}
        type={as === 'textarea' ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={as === 'textarea' ? rows : undefined}
        className={`w-full px-3.5 py-2.5 text-sm bg-paper text-ink border rounded-sm transition focus:outline-none focus:ring-2 disabled:bg-mist disabled:cursor-not-allowed ${
          error
            ? 'border-rejected focus:ring-rejected/30 focus:border-rejected'
            : 'border-line hover:border-navy-800/40 focus:border-brand-500 focus:ring-brand-500/20'
        }`}
        {...props}
      />

      {error ? (
        <p className="text-xs text-rejected font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted mt-0.5">{helperText}</p>
      ) : null}
    </div>
  )
}

