import { Routes, Route } from 'react-router-dom'

import SiteLayout from './components/layout/SiteLayout'

import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import Marketplace from './pages/sponsor/Marketplace'
import CreatorProfile from './pages/sponsor/CreatorProfile'
import Booking from './pages/sponsor/Booking'
import MyBookings from './pages/sponsor/MyBookings'
import Receipt from './pages/sponsor/Receipt'

import Dashboard from './pages/creator/Dashboard'
import Profile from './pages/creator/Profile'
import Tiers from './pages/creator/Tiers'
import Availability from './pages/creator/Availability'
import ReviewQueue from './pages/creator/ReviewQueue'

export default function App() {
  return (
    <Routes>
      {/* Pages with TopBar + Navbar + Footer */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/creators" element={<Marketplace />} />
        <Route path="/creators/:id" element={<CreatorProfile />} />
        <Route path="/book/:tierId" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/receipt/:bookingId" element={<Receipt />} />
      </Route>

      {/* Auth pages (full-screen design later) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Creator side (DashboardLayout comes later) */}
      <Route path="/creator/dashboard" element={<Dashboard />} />
      <Route path="/creator/profile" element={<Profile />} />
      <Route path="/creator/tiers" element={<Tiers />} />
      <Route path="/creator/availability" element={<Availability />} />
      <Route path="/creator/reviews" element={<ReviewQueue />} />
    </Routes>
  )
}