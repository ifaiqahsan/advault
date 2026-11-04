import { Routes, Route } from 'react-router-dom'

const Placeholder = ({ name }) => (
  <div className="p-10"><h1 className="text-4xl">{name}</h1></div>
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Landing" />} />
      <Route path="/login" element={<Placeholder name="Login" />} />
      <Route path="/register" element={<Placeholder name="Register" />} />

      <Route path="/creators" element={<Placeholder name="Marketplace" />} />
      <Route path="/creators/:id" element={<Placeholder name="Creator Profile" />} />
      <Route path="/book/:tierId" element={<Placeholder name="Booking" />} />
      <Route path="/my-bookings" element={<Placeholder name="My Bookings" />} />

      <Route path="/creator/dashboard" element={<Placeholder name="Creator Dashboard" />} />
      <Route path="/creator/tiers" element={<Placeholder name="Tiers" />} />
      <Route path="/creator/availability" element={<Placeholder name="Availability" />} />
      <Route path="/creator/reviews" element={<Placeholder name="Review Queue" />} />
    </Routes>
  )
}