import { useEffect, useState } from 'react'
import { FiGrid, FiSearch, FiTruck, FiUsers, FiGift, FiCheckCircle } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import DonationCard from '../../components/DonationCard'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { fetchDonations } from '../../services/api'
import { prioritizeDonations } from '../../ai/recommendation'

const navItems = [
  { to: '/ngo/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/ngo/nearby', label: 'Nearby Donations', icon: FiSearch },
]

export default function NgoDashboard() {
  const [donations, setDonations] = useState(null)

  useEffect(() => { fetchDonations().then((d) => setDonations(prioritizeDonations(d))) }, [])

  return (
    <DashboardLayout title="NGO Overview" navItems={navItems}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={FiGift} label="Active Donations" value={donations?.length ?? '—'} />
        <StatCard icon={FiTruck} label="Assigned Volunteers" value={3} accent="clay" />
        <StatCard icon={FiCheckCircle} label="Completed Deliveries" value={128} />
        <StatCard icon={FiUsers} label="People Served" value="9,100" accent="clay" />
      </div>

      <h2 className="font-display font-semibold text-lg mt-8 mb-4">Priority queue (AI-ranked by urgency)</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!donations && <LoadingSpinner />}
        {donations?.slice(0, 6).map((d) => (
          <DonationCard key={d.id} donation={d} action actionLabel={d.status === 'available' ? 'Accept Donation' : 'View Details'} />
        ))}
      </div>
    </DashboardLayout>
  )
}
