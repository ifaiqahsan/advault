import PageHero from '../../components/ui/PageHero'
import AdFormats from '../../components/sections/AdFormats'
import GuestCta from '../../components/sections/GuestCta'

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Transparent rates"
        title="Pricing"
        text="Every creator sets their own tiers. These are typical formats you will find."
      />
      <AdFormats />
      <GuestCta />
    </>
  )
}