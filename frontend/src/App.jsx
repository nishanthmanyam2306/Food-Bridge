import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import About from './pages/About'
import Features from './pages/Features'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'

import DonorDashboard from './pages/donor/DonorDashboard'
import DonateFood from './pages/donor/DonateFood'
import DonationHistory from './pages/donor/DonationHistory'

import NgoDashboard from './pages/ngo/NgoDashboard'
import NearbyDonations from './pages/ngo/NearbyDonations'

import VolunteerDashboard from './pages/volunteer/VolunteerDashboard'
import PickupRequests from './pages/volunteer/PickupRequests'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/donor/dashboard" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/donate" element={<ProtectedRoute role="donor"><DonateFood /></ProtectedRoute>} />
          <Route path="/donor/history" element={<ProtectedRoute role="donor"><DonationHistory /></ProtectedRoute>} />

          <Route path="/ngo/dashboard" element={<ProtectedRoute role="ngo"><NgoDashboard /></ProtectedRoute>} />
          <Route path="/ngo/nearby" element={<ProtectedRoute role="ngo"><NearbyDonations /></ProtectedRoute>} />

          <Route path="/volunteer/dashboard" element={<ProtectedRoute role="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
          <Route path="/volunteer/requests" element={<ProtectedRoute role="volunteer"><PickupRequests /></ProtectedRoute>} />

          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
