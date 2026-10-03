import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiGrid, FiPlusCircle, FiClock, FiBarChart2, FiGift, FiUsers, FiTrendingUp, FiBell } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import DonationCard from '../../components/DonationCard'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { fetchDonations, fetchNotifications } from '../../services/api'

const navItems = [
  { to: '/donor/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/donor/donate', label: 'Donate Food', icon: FiPlusCircle },
  { to: '/donor/history', label: 'History', icon: FiClock },
]

export default function DonorDashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState(null)
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetchDonations().then((all) => setDonations(all.filter((d) => d.donorId === user?.id || true).slice(0, 4)))
    fetchNotifications().then(setNotes)
  }, [user])

  return (
    <DashboardLayout title="Donor Overview" navItems={navItems}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={FiGift} label="Total Donations" value={26} />
        <StatCard icon={FiUsers} label="Meals Contributed" value="1,980" accent="clay" />
        <StatCard icon={FiTrendingUp} label="Impact Score" value="94" suffix="/100" />
        <StatCard icon={FiBell} label="Pending Pickup" value={donations ? donations.filter((d) => d.status !== 'delivered').length : '—'} accent="clay" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg">Your recent donations</h2>
        <Link to="/donor/donate" className="btn-accent text-sm px-4 py-2">+ New Donation</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {!donations && <LoadingSpinner />}
        {donations?.map((d) => <DonationCard key={d.id} donation={d} />)}
      </div>

      <h2 className="font-display font-semibold text-lg mt-10 mb-4">Notifications</h2>
      <div className="card divide-y divide-black/5 dark:divide-white/10">
        {notes.map((n) => (
          <div key={n.id} className="p-4 flex items-start gap-3">
            <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-transparent' : 'bg-clay-500'}`} />
            <div>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-ink-700 dark:text-white/50">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
