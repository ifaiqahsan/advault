import Card from '../../../components/ui/Card'
import StatusBadge from '../../../components/ui/StatusBadge'

/**
 * SubmissionPreview Component
 * Renders a visual mockup of how the sponsor's ad copy, image, and CTA
 * will look inside the creator's publication.
 *
 * Props:
 * - submission: the currently selected booking/submission object
 */
export default function SubmissionPreview({ submission }) {
  if (!submission) {
    return (
      <Card className="h-full flex items-center justify-center p-12 text-center text-muted">
        <div>
          <span className="text-3xl block mb-2">📄</span>
          <p className="text-sm font-semibold text-ink">No submission selected</p>
          <p className="text-xs mt-1">Select an item from the review queue on the left to inspect.</p>
        </div>
      </Card>
    )
  }

  const {
    sponsorName,
    sponsorEmail,
    tierName,
    slotDate,
    amount,
    status,
    headline,
    adCopy,
    adImageUrl,
    targetUrl,
    feedbackNote,
  } = submission

  // Calculate approximate word count
  const wordCount = adCopy ? adCopy.trim().split(/\s+/).length : 0

  return (
    <Card className="space-y-6">
      {/* Header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-2xl font-bold text-ink">
              {sponsorName}
            </h3>
            <StatusBadge status={status} />
          </div>
          <div className="text-xs text-muted mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span><strong>Tier:</strong> {tierName}</span>
            <span><strong>Slot:</strong> <span className="font-mono">{slotDate}</span></span>
            <span><strong>Amount:</strong> <span className="font-mono">${amount}</span></span>
            {sponsorEmail && <span><strong>Contact:</strong> {sponsorEmail}</span>}
          </div>
        </div>
      </div>

      {/* Revision / Feedback Note Banner (if present) */}
      {feedbackNote && (
        <div className={`p-4 rounded-sm border text-xs leading-relaxed ${
          status === 'rejected'
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-sky-50 border-sky-200 text-sky-900'
        }`}>
          <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>💬</span>
            <span>Creator Feedback Note:</span>
          </div>
          <p>{feedbackNote}</p>
        </div>
      )}

      {/* Visual Live Publication Mockup Frame */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading uppercase text-muted tracking-wider">
            Live Publication Mockup
          </span>
          <span className="text-xs font-mono text-muted">
            Word Count: <strong className="text-ink">{wordCount} words</strong>
          </span>
        </div>

        <div className="border-2 border-dashed border-navy-900/20 bg-mist/60 rounded-md p-6">
          <div className="bg-paper border border-line rounded-sm p-6 shadow-sm max-w-xl mx-auto space-y-4">
            {/* Ad Sponsor Eyebrow */}
            <div className="flex items-center justify-between text-[11px] text-muted border-b border-line pb-2">
              <span className="font-semibold uppercase tracking-wider text-brand-500 font-heading">
                Sponsored Feature
              </span>
              <span>via {sponsorName}</span>
            </div>

            {/* Ad Image / Banner */}
            {adImageUrl ? (
              <div className="rounded-sm overflow-hidden border border-line bg-mist">
                <img
                  src={adImageUrl}
                  alt={headline || 'Sponsor Creative'}
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : (
              <div className="p-4 bg-mist rounded-sm border border-dashed border-line text-center text-xs text-muted">
                (Text-only placement — No banner image provided)
              </div>
            )}

            {/* Headline */}
            {headline && (
              <h4 className="font-heading text-xl font-bold text-ink leading-snug">
                {headline}
              </h4>
            )}

            {/* Ad Copy */}
            <p className="text-sm text-ink/85 leading-relaxed">
              {adCopy || 'No ad copy body text submitted.'}
            </p>

            {/* Call to Action Button */}
            {targetUrl && (
              <div className="pt-2">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white font-heading uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm transition font-semibold"
                >
                  <span>Learn More</span>
                  <span>→</span>
                </a>
                <span className="block text-[11px] font-mono text-muted mt-2 truncate">
                  Destination: {targetUrl}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

