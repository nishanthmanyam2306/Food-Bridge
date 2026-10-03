// Lightweight AI/heuristic engine used by the UI for instant feedback.
// The authoritative version (with room to grow into a trained model) lives
// in backend/ai/recommend.py — this mirrors the same math so the dashboard
// can show live recommendations without a network round-trip.

/** Haversine distance in km between two {lat, lng} points. */
export function distanceKm(a, b) {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}
function toRad(deg) { return (deg * Math.PI) / 180 }

/** Minutes until a donation expires. Negative means already expired. */
export function minutesToExpiry(donation) {
  return (new Date(donation.expiryTime).getTime() - Date.now()) / 60000
}

/**
 * Urgency score 0–100. Combines expiry pressure with quantity, so a large
 * batch about to expire outranks a small one with the same time window.
 */
export function urgencyScore(donation) {
  const minsLeft = minutesToExpiry(donation)
  if (minsLeft <= 0) return 0
  const timePressure = Math.max(0, 100 - minsLeft / 3) // decays as expiry nears 300 min
  const sizeFactor = Math.min(20, donation.meals / 5)
  return Math.round(Math.min(100, timePressure * 0.8 + sizeFactor))
}

/** Estimated delivery time in minutes, assuming ~25 km/h average city speed + 8 min handling buffer. */
export function estimateDeliveryMinutes(distKm) {
  return Math.round((distKm / 25) * 60 + 8)
}

/**
 * Rank NGOs for a donation by a weighted score of distance and capacity
 * headroom. Returns NGOs sorted best-first with score + ETA attached.
 */
export function recommendNgos(donation, ngoList) {
  return ngoList
    .map((ngo) => {
      const dist = distanceKm(donation.location, ngo.location)
      const eta = estimateDeliveryMinutes(dist)
      const capacityScore = Math.min(1, ngo.capacity / 200)
      const ratingScore = ngo.rating / 5
      const distScore = Math.max(0, 1 - dist / 20)
      const score = distScore * 0.55 + capacityScore * 0.25 + ratingScore * 0.2
      return { ...ngo, distanceKm: Number(dist.toFixed(1)), etaMinutes: eta, matchScore: Math.round(score * 100) }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Rank available volunteers for a pickup by proximity and track record.
 */
export function recommendVolunteers(donation, volunteerList) {
  return volunteerList
    .filter((v) => v.available)
    .map((v) => {
      const dist = distanceKm(donation.location, v.location)
      const eta = estimateDeliveryMinutes(dist)
      const distScore = Math.max(0, 1 - dist / 15)
      const trackScore = Math.min(1, v.deliveries / 100) * 0.5 + (v.rating / 5) * 0.5
      const score = distScore * 0.65 + trackScore * 0.35
      return { ...v, distanceKm: Number(dist.toFixed(1)), etaMinutes: eta, matchScore: Math.round(score * 100) }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

/** Sort a list of donations by priority (most urgent + largest first). */
export function prioritizeDonations(donationList) {
  return [...donationList]
    .filter((d) => !['delivered', 'expired', 'cancelled'].includes(d.status))
    .map((d) => ({ ...d, urgency: urgencyScore(d) }))
    .sort((a, b) => b.urgency - a.urgency)
}

/**
 * Naive linear surplus forecast: given recent daily meal counts, project the
 * next N days using a simple moving-average trend. In backend/ai this same
 * idea is implemented with pandas/numpy and can be swapped for a real
 * regression (scikit-learn LinearRegression / ARIMA) once historical data exists.
 */
export function predictSurplusTrend(history, daysAhead = 7) {
  if (history.length < 2) return []
  const n = history.length
  const avgDelta = (history[n - 1] - history[0]) / (n - 1)
  const last = history[n - 1]
  return Array.from({ length: daysAhead }, (_, i) => Math.max(0, Math.round(last + avgDelta * (i + 1))))
}
