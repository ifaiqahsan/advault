import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from './BackToTop'

export default function SiteLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main key={pathname} className="flex-1 page-fade">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
