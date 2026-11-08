import { Routes, Route } from 'react-router-dom'

import SiteLayout from './components/layout/SiteLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Home from './pages/public/Home'
import Process from './pages/public/Process'
import Pricing from './pages/public/Pricing'
import LogIn from './pages/public/Login'
import SignUp from './pages/public/Signup'

import Checkout from './pages/sponsor/Checkout'
import Bookings from './pages/sponsor/Bookings'
import Receipt from './pages/sponsor/Receipt'
import Creators from './pages/sponsor/Creators'
import CreatorDetail from './pages/sponsor/CreatorDetail'

import Dashboard from './pages/creator/Dashboard'
import Profile from './pages/creator/Profile'
import Tiers from './pages/creator/Tiers'
import Calendar from './pages/creator/Calendar'
import Reviews from './pages/creator/Reviews'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/creators/:id" element={<CreatorDetail />} />
        <Route path="/process" element={<Process />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route element={<ProtectedRoute role="sponsor" />}>
          <Route path="/book/:tierId" element={<Checkout />} />
          <Route path="/my-bookings" element={<Bookings />} />
          <Route path="/receipt/:bookingId" element={<Receipt />} />
        </Route>

        <Route element={<ProtectedRoute role="creator" />}>
          <Route path="/creator/dashboard" element={<Dashboard />} />
          <Route path="/creator/profile" element={<Profile />} />
          <Route path="/creator/tiers" element={<Tiers />} />
          <Route path="/creator/availability" element={<Calendar />} />
          <Route path="/creator/reviews" element={<Reviews />} />
        </Route>
      </Route>

      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<SignUp />} />
    </Routes>
  )
}