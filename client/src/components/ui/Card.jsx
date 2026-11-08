export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  ...props
}) {
  return (
    <div
      className={`bg-paper border border-line rounded-md shadow-xs p-6 ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-line">
          <div>
            {title && (
              <h3 className="font-heading text-xl text-ink font-bold tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

