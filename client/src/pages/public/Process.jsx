import PageHero from '../../components/ui/PageHero'
import HowItWorks from '../../components/sections/HowItWorks'
import GuestCta from '../../components/sections/GuestCta'

export default function Process() {
  return (
    <>
      <PageHero eyebrow="From setup to payout" title="How It Works" text="Four stages take an ad from idea to published slot, with no middlemen." />
      <HowItWorks />
      <GuestCta />
    </>
  )
}
