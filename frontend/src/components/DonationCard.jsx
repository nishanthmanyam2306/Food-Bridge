import { FiClock, FiMapPin, FiUsers } from 'react-icons/fi'
import { statusLabels } from '../services/mockData'
import { urgencyScore, minutesToExpiry } from '../ai/recommendation'

const statusColors = {
  available: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
  accepted: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
  volunteer_assigned: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
  picked_up: 'bg-clay-500/10 text-clay-600 dark:text-clay-300',
  in_transit: 'bg-clay-500/10 text-clay-600 dark:text-clay-300',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
  expired: 'bg-red-500/10 text-red-600 dark:text-red-300',
  cancelled: 'bg-gray-500/10 text-gray-500',
}

export default function DonationCard({ donation, action, actionLabel, onAction }) {
  const urgency = urgencyScore(donation)
  const minsLeft = Math.max(0, Math.round(minutesToExpiry(donation)))
  const urgent = urgency > 60

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-lg leading-tight">{donation.foodName}</h3>
          <p className="text-xs text-ink-700 dark:text-white/50">{donation.category} · {donation.vegType === 'veg' ? 'Veg' : 'Non-Veg'} · #{donation.id}</p>
        </div>
        <span className={`badge ${statusColors[donation.status] || 'bg-gray-500/10 text-gray-500'}`}>
          {statusLabels[donation.status] || donation.status}
        </span>
      </div>

      <p className="text-sm text-ink-700 dark:text-white/70 line-clamp-2">{donation.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-ink-700 dark:text-white/60">
        <span className="flex items-center gap-1"><FiUsers size={14} /> {donation.meals} meals</span>
        <span className="flex items-center gap-1"><FiMapPin size={14} /> {donation.location?.address || 'Location shared'}</span>
        <span className={`flex items-center gap-1 ${urgent ? 'text-clay-600 dark:text-clay-400 font-semibold' : ''}`}>
          <FiClock size={14} /> {minsLeft > 0 ? `${minsLeft} min left` : 'Expired'}
        </span>
      </div>

      {urgent && minsLeft > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-clay-500" style={{ width: `${urgency}%` }} />
          </div>
          <span className="text-xs font-semibold text-clay-600 dark:text-clay-400">AI priority {urgency}</span>
        </div>
      )}

      {action && (
        <button onClick={() => onAction?.(donation)} className="btn-primary mt-1 w-full text-sm py-2.5">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
