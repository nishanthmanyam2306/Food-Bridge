import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiGrid, FiSearch } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import DonationCard from '../../components/DonationCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { fetchDonations, updateDonationStatus } from '../../services/api'
import { distanceKm, urgencyScore } from '../../ai/recommendation'
import { mockUser } from '../../services/mockData'

const navItems = [
  { to: '/ngo/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/ngo/nearby', label: 'Nearby Donations', icon: FiSearch },
]

export default function NearbyDonations() {
  const [donations, setDonations] = useState(null)
  const [query, setQuery] = useState('')
  const [vegFilter, setVegFilter] = useState('all')

  useEffect(() => { fetchDonations().then(setDonations) }, [])

  async function handleAccept(donation) {
    await updateDonationStatus(donation.id, 'accepted')
    setDonations((all) => all.map((d) => (d.id === donation.id ? { ...d, status: 'accepted', ngo: mockUser.ngo.name } : d)))
    toast.success(`Accepted ${donation.foodName} — a volunteer will be matched next`)
  }

  const filtered = donations
    ?.map((d) => ({ ...d, distanceKm: distanceKm(mockUser.ngo.location, d.location).toFixed(1), urgency: urgencyScore(d) }))
    .filter((d) => d.foodName.toLowerCase().includes(query.toLowerCase()))
    .filter((d) => vegFilter === 'all' || d.vegType === vegFilter)
    .sort((a, b) => b.urgency - a.urgency)

  return (
    <DashboardLayout title="Nearby Donations" navItems={navItems}>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search food or donor…" className="input sm:max-w-xs" />
        <div className="flex gap-2">
          {['all', 'veg', 'non-veg'].map((v) => (
            <button key={v} onClick={() => setVegFilter(v)} className={`px-4 py-2 rounded-full text-xs font-medium border ${vegFilter === v ? 'bg-brand-500 text-white border-brand-500' : 'border-black/10 dark:border-white/15'}`}>
              {v === 'all' ? 'All' : v === 'veg' ? 'Veg' : 'Non-Veg'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!filtered && <LoadingSpinner />}
        {filtered?.map((d) => (
          <DonationCard key={d.id} donation={d} action={d.status === 'available'} actionLabel="Accept" onAction={handleAccept} />
        ))}
      </div>
    </DashboardLayout>
  )
}
