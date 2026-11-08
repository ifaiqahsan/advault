import Card from '../../../components/ui/Card'

/**
 * StatCard Component
 * Displays a high-level KPI metric card for creator business performance.
 *
 * Props:
 * - title: metric label (e.g., "Total Earnings", "Pending Submissions")
 * - value: primary value string or number (e.g., "$1,200", "3")
 * - subtitle: contextual comparison or description
 * - icon: visual icon indicator
 * - highlight: boolean to apply primary brand accent
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  highlight = false,
}) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-150 ${
        highlight
          ? 'border-brand-500/40 bg-gradient-to-br from-paper to-brand-50/30'
          : 'hover:border-navy-800/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-heading uppercase text-muted tracking-wider block">
            {title}
          </span>
          <div
            className={`text-3xl font-heading font-extrabold tracking-tight mt-1.5 ${
              highlight ? 'text-brand-500' : 'text-ink'
            }`}
          >
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Visual Icon Badge */}
        {icon && (
          <div
            className={`w-11 h-11 rounded-sm flex items-center justify-center font-heading text-xl font-bold shrink-0 ${
              highlight
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-mist text-navy-900 border border-line'
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

