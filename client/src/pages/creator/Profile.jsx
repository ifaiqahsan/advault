import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import Toast from '../../components/ui/Toast'
import useToast from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { compact, typeLabel } from '../../utils/format'
import ProfileForm from './components/ProfileForm'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { creators, upsertCreator } = useData()
  const { toast, show, clear } = useToast()
  const cid = user.creatorId

  const saved = creators.find((c) => c.id === cid)
  const base = saved || { id: cid, name: user.name, type: 'newsletter', bio: '', audienceSize: 0, website: '', img: '', social: {}, email: user.email, verified: false }
  const [profile, setProfile] = useState(base)

  const save = (data) => {
    const next = { ...data, id: cid, email: base.email, verified: base.verified }
    setProfile(next)
    upsertCreator(next)
    updateProfile({ name: user.name })
    show('Profile saved. Sponsors can now see your changes.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const links = [['twitter', 'X'], ['linkedin', 'LinkedIn'], ['github', 'GitHub']].filter(([k]) => profile.social?.[k])

  return (
    <DashboardLayout title="Media profile" subtitle="Manage how sponsors see your publication in the marketplace.">
      <Toast toast={toast} onClose={clear} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <ProfileForm initialData={profile} onSave={save} />
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <div className="bg-paper border border-line overflow-hidden lift">
            <div className="relative h-40 bg-navy-900">
              {profile.img ? (
                <img src={profile.img} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full grid place-items-center font-heading text-7xl text-white/20">{(profile.name || 'C').charAt(0)}</div>
              )}
              <span className="absolute top-0 left-0 bg-brand-600 text-white text-xs font-heading uppercase tracking-wider px-3 py-1.5">
                {typeLabel[profile.type] || profile.type}
              </span>
            </div>
            <div className="p-5 border-b-4 border-brand-500">
              <p className="text-[11px] uppercase tracking-wider text-muted mb-1">Marketplace preview</p>
              <h4 className="text-2xl text-ink">{profile.name || 'Untitled media'}</h4>
              <p className="text-xs text-ink/80 mt-2 leading-relaxed">{profile.bio || 'No description yet.'}</p>
              <div className="mt-4 p-3 bg-mist border border-line flex items-center justify-between text-xs">
                <span className="text-muted uppercase tracking-wider">Audience</span>
                <span className="font-heading text-xl text-ink">{compact(profile.audienceSize)}</span>
              </div>
              {profile.website && <p className="text-xs text-brand-500 truncate mt-3">{profile.website}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {links.length === 0 ? (
                  <span className="text-xs text-muted italic">No social accounts connected</span>
                ) : (
                  links.map(([k, label]) => (
                    <span key={k} className="px-2 py-1 bg-white border border-line text-[11px] text-ink/80">{label}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
