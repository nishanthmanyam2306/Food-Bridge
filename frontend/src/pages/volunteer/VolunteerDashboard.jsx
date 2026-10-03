import { useEffect, useState } from 'react'
import { FiGrid, FiTruck, FiAward, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import DonationCard from '../../components/DonationCard'
import StatCard from '../../components/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { fetchDonations } from '../../services/api'
import { mockUser } from '../../services/mockData'

const navItems = [
  { to: '/volunteer/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/volunteer/requests', label: 'Pickup Requests', icon: FiTruck },
]

const badges = [
  { label: 'First Delivery', earned: true },
  { label: '10 Deliveries', earned: true },
  { label: '50 Deliveries', earned: false },
  { label: 'Speed Star (< 20 min avg)', earned: true },
]

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState(null)

  useEffect(() => { fetchDonations().then((d) => setTasks(d.filter((x) => x.status === 'volunteer_assigned' || x.status === 'in_transit'))) }, [])

  return (
    <DashboardLayout title="Volunteer Overview" navItems={navItems}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={FiTruck} label="Total Deliveries" value={mockUser.volunteer.deliveries} />
        <StatCard icon={FiCheckCircle} label="On-Time Rate" value="96" suffix="%" accent="clay" />
        <StatCard icon={FiAward} label="Rating" value={mockUser.volunteer.rating} suffix=" / 5" />
        <StatCard icon={FiMapPin} label="Today's Tasks" value={tasks?.length ?? '—'} accent="clay" />
      </div>

      <h2 className="font-display font-semibold text-lg mt-8 mb-4">Today's tasks</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!tasks && <LoadingSpinner />}
        {tasks?.length === 0 && <p className="text-sm text-ink-700 dark:text-white/50">No active tasks right now — check pickup requests.</p>}
        {tasks?.map((d) => <DonationCard key={d.id} donation={d} action actionLabel="Confirm Pickup" />)}
      </div>

      <h2 className="font-display font-semibold text-lg mt-10 mb-4">Achievements</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b) => (
          <div key={b.label} className={`card p-5 text-center ${!b.earned && 'opacity-40'}`}>
            <FiAward className={`mx-auto mb-2 ${b.earned ? 'text-clay-500' : 'text-ink-700 dark:text-white/40'}`} size={26} />
            <p className="text-xs font-medium">{b.label}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
