import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Toast from '../../components/ui/Toast'
import useToast from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import SubmissionList from './components/SubmissionList'
import SubmissionPreview from './components/SubmissionPreview'
import ReviewActions from './components/ReviewActions'

export default function ReviewQueue() {
  const { user } = useAuth()
  const { bookings, tiers, reviewBooking } = useData()
  const { toast, show, clear } = useToast()
  const cid = user.creatorId

  const mine = bookings.filter((b) => b.creatorId === cid)
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all')

  const activeId = selectedId || mine.find((b) => b.status === 'pending')?.id || mine[0]?.id
  const active = mine.find((b) => b.id === activeId) || null
  const limit = tiers.find((t) => t.id === active?.tierId)?.wordLimit

  const approve = (id) => {
    reviewBooking(id, 'approved')
    show('Creative approved. The date is locked and payment captured.')
  }

  const revise = (id, note) => {
    reviewBooking(id, 'revision_requested', note)
    show('Revision request sent to the sponsor.', 'info')
  }

  const reject = (id, note) => {
    reviewBooking(id, 'rejected', note)
    show('Submission rejected and payment released.', 'error')
  }

  return (
    <DashboardLayout title="Review queue" subtitle="Inspect sponsor creatives before they appear in your publication.">
      <Toast toast={toast} onClose={clear} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <SubmissionList submissions={mine} selectedId={activeId} onSelect={(i) => setSelectedId(i.id)} activeFilter={filter} onFilterChange={setFilter} />
        </div>

        <div key={activeId} className="lg:col-span-7 space-y-6 fade-in">
          <SubmissionPreview submission={active} wordLimit={limit} />
          {active && <ReviewActions submission={active} onApprove={approve} onRequestRevision={revise} onReject={reject} />}
        </div>
      </div>
    </DashboardLayout>
  )
}
