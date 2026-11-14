import PageHero from '../../components/ui/PageHero'
import Button from '../../components/ui/Button'

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Error 404" title="Page Not Found" crumb="404" />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-heading text-9xl font-extrabold ghost">404</p>
        <h2 className="text-4xl text-navy-950 -mt-10 relative">This slot is empty</h2>
        <p className="text-muted mt-3 mb-8">The page you are looking for does not exist or was moved.</p>
        <div className="flex justify-center gap-4">
          <Button to="/" size="lg">Back to home</Button>
          <Button to="/creators" variant="outline" size="lg">Browse creators</Button>
        </div>
      </section>
    </>
  )
}
