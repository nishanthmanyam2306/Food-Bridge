import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiGrid, FiTruck, FiMapPin, FiClock } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { fetchDonations, updateDonationStatus } from '../../services/api'
import { distanceKm, estimateDeliveryMinutes, urgencyScore } from '../../ai/recommendation'
import { mockUser } from '../../services/mockData'

const navItems = [
  { to: '/volunteer/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/volunteer/requests', label: 'Pickup Requests', icon: FiTruck },
]

export default function PickupRequests() {
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    fetchDonations().then((all) => {
      const ranked = all
        .filter((d) => d.status === 'accepted')
        .map((d) => {
          const dist = distanceKm(mockUser.volunteer.location, d.location)
          return { ...d, distanceKm: dist.toFixed(1), eta: estimateDeliveryMinutes(dist), urgency: urgencyScore(d) }
        })
        .sort((a, b) => b.urgency - a.urgency)
      setRequests(ranked)
    })
  }, [])

  async function respond(donation, accept) {
    if (accept) {
      await updateDonationStatus(donation.id, 'volunteer_assigned')
      toast.success(`Pickup accepted — route to ${donation.location?.address || 'pickup point'} ready`)
    } else {
      toast('Request passed to the next available volunteer', { icon: '↪️' })
    }
    setRequests((r) => r.filter((d) => d.id !== donation.id))
  }

  return (
    <DashboardLayout title="Pickup Requests" navItems={navItems}>
      <p className="text-sm text-ink-700 dark:text-white/60 mb-5">Ranked by AI on urgency, distance, and estimated delivery time.</p>

      <div className="space-y-4">
        {!requests && <LoadingSpinner />}
        {requests?.length === 0 && <p className="text-sm text-ink-700 dark:text-white/50">No pending requests nearby right now.</p>}
        {requests?.map((d) => (
          <div key={d.id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold">{d.foodName}</h3>
                {d.urgency > 60 && <span className="badge bg-clay-500/10 text-clay-600 dark:text-clay-400">Urgent · {d.urgency}</span>}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-ink-700 dark:text-white/60 mt-1">
                <span className="flex items-center gap-1"><FiMapPin size={14} /> {d.distanceKm} km · ETA {d.eta} min</span>
                <span className="flex items-center gap-1"><FiClock size={14} /> Pickup by {new Date(d.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>from {d.donor}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => respond(d, false)} className="btn-outline text-sm px-4 py-2">Reject</button>
              <button onClick={() => respond(d, true)} className="btn-primary text-sm px-4 py-2">Accept</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
