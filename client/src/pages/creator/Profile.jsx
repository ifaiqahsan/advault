import { useState, useContext } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'
import { AuthContext } from '../../context/AuthContent'
import ProfileForm from './components/ProfileForm'

/**
 * Profile Page Component
 * Allows verified creators to update their public publication profile,
 * audience statistics, and external media links.
 */
export default function Profile() {
  const auth = useContext(AuthContext)
  const currentCreator = auth?.user || {
    id: 'creator-1',
    name: 'TechBytes Weekly',
    type: 'newsletter',
    bio: 'Curated weekly breakdown of developer tooling, open source projects, and software engineering architecture.',
    audienceSize: 45000,
    website: 'https://techbytes.dev',
    social: {
      twitter: 'https://x.com/techbytes',
      linkedin: 'https://linkedin.com/company/techbytes',
      github: 'https://github.com/techbytes',
    },
  }

  // Local state for creator profile draft
  const [profile, setProfile] = useState(currentCreator)

  // Success alert message on save
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Handler for updated profile save
  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile)

    // Also update parent AuthContext if updater method provided
    if (auth?.updateProfile) {
      auth.updateProfile(updatedProfile)
    }

    setSaveSuccess(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setSaveSuccess(false)
    }, 5000)
  }

  return (
    <DashboardLayout
      title="Media Profile"
      subtitle="Manage your public publication profile, readership metrics, and verified links."
    >
      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-approved text-white flex items-center justify-center text-xs font-bold shrink-0">
              ✓
            </span>
            <div>
              <p className="font-semibold text-emerald-950">
                Media Profile Saved Successfully!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your changes have been saved to local state and will be reflected across your sponsorship listings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold uppercase tracking-wider"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <ProfileForm
              initialData={profile}
              onSave={handleSaveProfile}
            />
          </Card>
        </div>

        {/* Live Marketplace Preview Card */}
        <div className="space-y-6">
          <Card
            title="Public Preview"
            subtitle="How your publication appears to sponsors in the AdVault marketplace"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-navy-900 text-white font-heading font-black text-2xl flex items-center justify-center">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-ink leading-tight">
                    {profile.name || 'Untitled Media'}
                  </h4>
                  <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-mist rounded-xs border border-line text-ink/70">
                    {profile.type}
                  </span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-ink/80 leading-relaxed border-t border-line pt-3">
                {profile.bio || 'No description provided yet.'}
              </p>

              {/* Audience stats */}
              <div className="p-3 bg-mist rounded-sm border border-line flex items-center justify-between text-xs">
                <span className="text-muted font-heading uppercase tracking-wider text-[11px]">
                  Audience Size
                </span>
                <span className="font-mono font-bold text-ink text-sm">
                  {Number(profile.audienceSize || 0).toLocaleString()}
                </span>
              </div>

              {/* External website */}
              {profile.website && (
                <div className="text-xs truncate">
                  <span className="text-muted block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Official Website
                  </span>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-500 hover:underline font-mono truncate block"
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              {/* Social links preview */}
              <div className="border-t border-line pt-3">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wider mb-2">
                  Connected Channels
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {profile.social?.twitter && (
                    <span className="px-2 py-1 bg-white border border-line rounded-xs text-ink/80 text-[11px]">
                      X / Twitter
                    </span>
                  )}
                  {profile.social?.linkedin && (
                    <span className="px-2 py-1 bg-white border border-line rounded-xs text-ink/80 text-[11px]">
                      LinkedIn
                    </span>
                  )}
                  {profile.social?.github && (
                    <span className="px-2 py-1 bg-white border border-line rounded-xs text-ink/80 text-[11px]">
                      GitHub
                    </span>
                  )}
                  {!profile.social?.twitter &&
                    !profile.social?.linkedin &&
                    !profile.social?.github && (
                      <span className="text-xs text-muted italic">
                        No social accounts connected
                      </span>
                    )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
