import { Routes, Route, Navigate } from 'react-router-dom'

import SiteLayout from './components/layout/SiteLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import ScrollToTop from './components/layout/ScrollToTop'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Process from './pages/public/Process'
import Pricing from './pages/public/Pricing'
import LogIn from './pages/public/Login'
import SignUp from './pages/public/SignUp'
import NotFound from './pages/public/NotFound'

import Creators from './pages/sponsor/Creators'
import CreatorDetail from './pages/sponsor/CreatorDetail'
import SponsorDashboard from './pages/sponsor/Dashboard'
import Checkout from './pages/sponsor/Checkout'
import Bookings from './pages/sponsor/Bookings'
import Submit from './pages/sponsor/Submit'
import Receipt from './pages/sponsor/Receipt'

import Dashboard from './pages/creator/Dashboard'
import Profile from './pages/creator/Profile'
import Tiers from './pages/creator/Tiers'
import Calendar from './pages/creator/Calendar'
import Reviews from './pages/creator/Reviews'
import Analytics from './pages/creator/Analytics'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creators/:id" element={<CreatorDetail />} />
          <Route path="/process" element={<Process />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<ProtectedRoute role="sponsor" />}>
            <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
            <Route path="/book/:tierId" element={<Checkout />} />
            <Route path="/my-bookings" element={<Bookings />} />
            <Route path="/submit/:bookingId" element={<Submit />} />
            <Route path="/receipt/:bookingId" element={<Receipt />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute role="creator" />}>
          <Route path="/creator" element={<Navigate to="/creator/dashboard" replace />} />
          <Route path="/creator/dashboard" element={<Dashboard />} />
          <Route path="/creator/profile" element={<Profile />} />
          <Route path="/creator/tiers" element={<Tiers />} />
          <Route path="/creator/availability" element={<Calendar />} />
          <Route path="/creator/reviews" element={<Reviews />} />
          <Route path="/creator/analytics" element={<Analytics />} />
        </Route>

        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </>
  )
}
