import Card from '../../../components/ui/Card'
import StatusBadge from '../../../components/ui/StatusBadge'
import { formatDate, money, wordCount } from '../../../utils/format'

export default function SubmissionPreview({ submission, wordLimit }) {
  if (!submission) {
    return (
      <Card className="text-center py-16">
        <p className="font-heading text-2xl text-ink">No submission selected</p>
        <p className="text-xs text-muted mt-1">Pick an item from the queue to inspect it.</p>
      </Card>
    )
  }

  const { sponsorName, sponsorEmail, tierName, slotDate, amount, status, paymentStatus, headline, adCopy, adImageUrl, targetUrl, feedbackNote } = submission
  const words = wordCount(adCopy)
  const over = wordLimit && words > wordLimit

  return (
    <Card className="space-y-6" accent>
      <div className="pb-4 border-b border-line">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-3xl text-ink">{sponsorName}</h3>
          <StatusBadge status={status} />
          <StatusBadge status={paymentStatus} />
        </div>
        <div className="text-xs text-muted mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <span><strong>Tier:</strong> {tierName}</span>
          <span><strong>Slot:</strong> {formatDate(slotDate)}</span>
          <span><strong>Amount:</strong> {money(amount)}</span>
          {sponsorEmail && <span><strong>Contact:</strong> {sponsorEmail}</span>}
        </div>
      </div>

      {feedbackNote && (
        <div className={`p-4 border-l-4 text-xs leading-relaxed ${status === 'rejected' ? 'bg-red-50 border-rejected text-red-900' : 'bg-sky-50 border-revision text-sky-900'}`}>
          <p className="font-bold uppercase tracking-wider mb-1">Your feedback</p>
          <p>{feedbackNote}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading uppercase text-muted tracking-wider">Publication preview</span>
          <span className={`text-xs ${over ? 'text-rejected font-bold' : 'text-muted'}`}>
            {words}{wordLimit ? ` / ${wordLimit}` : ''} words
          </span>
        </div>

        <div className="bg-mist border border-line p-5">
          <div className="bg-paper border border-line p-6 max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-muted border-b border-line pb-2">
              <span className="font-heading uppercase tracking-wider text-brand-500">Sponsored</span>
              <span>via {sponsorName}</span>
            </div>
            {adImageUrl ? (
              <img src={adImageUrl} alt={headline} className="w-full h-48 object-cover" />
            ) : (
              <div className="p-3 bg-mist border border-dashed border-line text-center text-xs text-muted">Text-only placement</div>
            )}
            {headline && <h4 className="text-2xl text-ink normal-case leading-snug">{headline}</h4>}
            <p className="text-sm text-ink/85 leading-relaxed">{adCopy || 'No ad copy submitted.'}</p>
            {targetUrl && (
              <div>
                <a href={targetUrl} target="_blank" rel="noreferrer" className="inline-block bg-navy-900 hover:bg-brand-600 text-white font-heading uppercase tracking-wider text-xs px-5 py-2.5 transition">
                  Learn more
                </a>
                <span className="block text-[11px] text-muted mt-2 truncate">{targetUrl}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
