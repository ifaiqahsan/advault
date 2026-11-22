import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Toast from '../../components/ui/Toast'
import EmptyState from '../../components/ui/EmptyState'
import useToast from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { money } from '../../utils/format'
import TierCard from './components/TierCard'
import TierForm from './components/TierForm'
import DeleteTierConfirm from './components/DeleteTierConfirm'

export default function Tiers() {
  const { user } = useAuth()
  const { tiers, addTier, updateTier, removeTier } = useData()
  const { toast, show, clear } = useToast()
  const cid = user.creatorId

  const mine = tiers.filter((t) => t.creatorId === cid)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const average = mine.length ? Math.round(mine.reduce((s, t) => s + Number(t.price), 0) / mine.length) : 0

  const create = (data) => {
    addTier(cid, data)
    setCreating(false)
    show(`Created tier "${data.name}".`)
  }

  const update = (data) => {
    updateTier(data.id, data)
    setEditing(null)
    show(`Updated tier "${data.name}".`)
  }

  const remove = () => {
    removeTier(deleting.id)
    show(`Deleted tier "${deleting.name}".`, 'info')
    setDeleting(null)
  }

  return (
    <DashboardLayout
      title="Sponsorship tiers"
      subtitle="Define and price the ad slots sponsors can book."
      action={<Button onClick={() => setCreating(true)}>New tier</Button>}
    >
      <Toast toast={toast} onClose={clear} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-navy-900 text-white p-5 border-b-4 border-brand-500">
          <p className="text-xs uppercase tracking-wider text-white/60">Active tiers</p>
          <p className="font-heading text-5xl">{mine.length}</p>
        </div>
        <div className="bg-navy-900 text-white p-5 border-b-4 border-brand-500">
          <p className="text-xs uppercase tracking-wider text-white/60">Average slot price</p>
          <p className="font-heading text-5xl text-brand-500">{money(average)}</p>
        </div>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="No tiers yet"
          text="Create your first tier so sponsors can start booking your calendar."
          action={<Button onClick={() => setCreating(true)}>Create your first tier</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mine.map((t) => (
            <TierCard key={t.id} tier={t} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <Modal isOpen={creating} onClose={() => setCreating(false)} title="Create sponsorship tier">
        <TierForm initialData={null} onSubmit={create} onCancel={() => setCreating(false)} />
      </Modal>

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={`Edit tier: ${editing?.name || ''}`}>
        {editing && <TierForm initialData={editing} onSubmit={update} onCancel={() => setEditing(null)} />}
      </Modal>

      <Modal isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete tier">
        <DeleteTierConfirm tier={deleting} onConfirm={remove} onCancel={() => setDeleting(null)} />
      </Modal>
    </DashboardLayout>
  )
}
