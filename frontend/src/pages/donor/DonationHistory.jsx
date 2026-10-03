import { useEffect, useState } from 'react'
import { FiGrid, FiPlusCircle, FiClock } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import DonationCard from '../../components/DonationCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { statusLabels } from '../../services/mockData'
import { fetchDonations } from '../../services/api'

const navItems = [
  { to: '/donor/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/donor/donate', label: 'Donate Food', icon: FiPlusCircle },
  { to: '/donor/history', label: 'History', icon: FiClock },
]

export default function DonationHistory() {
  const [donations, setDonations] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchDonations().then(setDonations) }, [])

  const filtered = donations?.filter((d) => filter === 'all' || d.status === filter)

  return (
    <DashboardLayout title="Donation History" navItems={navItems}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', ...Object.keys(statusLabels)].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${filter === s ? 'bg-brand-500 text-white border-brand-500' : 'border-black/10 dark:border-white/15 text-ink-700 dark:text-white/60'}`}>
            {s === 'all' ? 'All' : statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {!donations && <LoadingSpinner />}
        {filtered?.length === 0 && <p className="text-sm text-ink-700 dark:text-white/50">No donations in this status.</p>}
        {filtered?.map((d) => <DonationCard key={d.id} donation={d} />)}
      </div>
    </DashboardLayout>
  )
}
