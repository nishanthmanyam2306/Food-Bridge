import { FiGift, FiCpu, FiUsers, FiMapPin, FiBarChart2, FiShield, FiBell, FiTrendingUp } from 'react-icons/fi'

const features = [
  { icon: FiGift, title: 'Smart Food Donation', text: 'List surplus food in under a minute with category, quantity, expiry, and pickup window.' },
  { icon: FiCpu, title: 'AI NGO Matching', text: 'Every donation is scored against nearby NGOs by distance, capacity, and rating for the fastest match.' },
  { icon: FiUsers, title: 'Volunteer Coordination', text: 'Available volunteers are ranked by proximity and delivery track record for each pickup.' },
  { icon: FiMapPin, title: 'Real-Time Tracking', text: 'Follow donation status, volunteer location, and estimated arrival — live, on the map.' },
  { icon: FiBarChart2, title: 'Impact Dashboard', text: 'Meals saved, food waste reduced, and CO₂ avoided — tracked per donor, NGO, and volunteer.' },
  { icon: FiShield, title: 'Secure Authentication', text: 'Role-based access with Firebase Auth, protected routes, and email verification.' },
  { icon: FiBell, title: 'Notifications', text: 'Real-time alerts at every stage — from upload to acceptance to delivery confirmation.' },
  { icon: FiTrendingUp, title: 'Sustainability Analytics', text: 'Forecast surplus trends and demand patterns to plan ahead, not just react.' },
]

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-20">
      <h1 className="text-4xl font-display font-semibold text-center">Built for every side of the bridge</h1>
      <p className="text-center text-ink-700 dark:text-white/60 mt-3 max-w-xl mx-auto">Everything donors, NGOs, and volunteers need to move food fast.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <div className="h-11 w-11 rounded-full bg-clay-500/10 text-clay-500 flex items-center justify-center mb-4"><f.icon size={19} /></div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-ink-700 dark:text-white/60 mt-2">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
