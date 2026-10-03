import { useState } from 'react'
import { FiGrid, FiPlusCircle, FiClock, FiUploadCloud, FiMapPin } from 'react-icons/fi'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'
import { createDonation } from '../../services/api'
import { recommendNgos } from '../../ai/recommendation'
import { ngos, mockUser } from '../../services/mockData'

const navItems = [
  { to: '/donor/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/donor/donate', label: 'Donate Food', icon: FiPlusCircle },
  { to: '/donor/history', label: 'History', icon: FiClock },
]

const categories = ['Cooked Meal', 'Bakery', 'Groceries', 'Dessert', 'Beverages', 'Packaged Food']

export default function DonateFood() {
  const [form, setForm] = useState({
    foodName: '', category: categories[0], vegType: 'veg', quantityKg: '', meals: '',
    expiryMinutes: '120', pickupMinutes: '30', description: '', contact: '', address: '', instructions: '',
  })
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [matches, setMatches] = useState(null)

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const donation = {
        ...form,
        quantityKg: Number(form.quantityKg),
        meals: Number(form.meals),
        expiryTime: new Date(Date.now() + Number(form.expiryMinutes) * 60000).toISOString(),
        pickupTime: new Date(Date.now() + Number(form.pickupMinutes) * 60000).toISOString(),
        donor: mockUser.donor.name,
        donorId: mockUser.donor.id,
        location: { ...mockUser.donor.location, address: form.address || 'Shared on pickup' },
      }
      const created = await createDonation(donation)
      const ranked = recommendNgos(donation, ngos)
      setMatches(ranked)
      toast.success(`Donation ${created.id} listed — matching NGOs found`)
    } catch (err) {
      toast.error('Something went wrong — please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="Donate Food" navItems={navItems}>
      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Food Name">
              <input required value={form.foodName} onChange={(e) => update('foodName', e.target.value)} className="input" placeholder="e.g. Vegetable Biryani" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Veg / Non-Veg">
            <div className="flex gap-3">
              {['veg', 'non-veg'].map((v) => (
                <button type="button" key={v} onClick={() => update('vegType', v)}
                  className={`px-4 py-2 rounded-full text-sm border ${form.vegType === v ? 'bg-brand-500 text-white border-brand-500' : 'border-black/10 dark:border-white/15'}`}>
                  {v === 'veg' ? 'Veg' : 'Non-Veg'}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Quantity (kg)"><input required type="number" min="0" value={form.quantityKg} onChange={(e) => update('quantityKg', e.target.value)} className="input" /></Field>
            <Field label="Number of Meals"><input required type="number" min="0" value={form.meals} onChange={(e) => update('meals', e.target.value)} className="input" /></Field>
            <Field label="Contact Number"><input required value={form.contact} onChange={(e) => update('contact', e.target.value)} className="input" placeholder="+91" /></Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Expires in (minutes)"><input required type="number" min="5" value={form.expiryMinutes} onChange={(e) => update('expiryMinutes', e.target.value)} className="input" /></Field>
            <Field label="Ready for pickup in (minutes)"><input required type="number" min="0" value={form.pickupMinutes} onChange={(e) => update('pickupMinutes', e.target.value)} className="input" /></Field>
          </div>

          <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} className="input" placeholder="Packaging, freshness, allergens, etc." /></Field>

          <Field label="Pickup Location">
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3.5 text-ink-700 dark:text-white/40" size={16} />
              <input value={form.address} onChange={(e) => update('address', e.target.value)} className="input pl-9" placeholder="Address or drop a pin on the map" />
            </div>
          </Field>

          <Field label="Special Instructions"><input value={form.instructions} onChange={(e) => update('instructions', e.target.value)} className="input" placeholder="Optional" /></Field>

          <Field label="Food Image">
            <label className="border-2 border-dashed border-black/10 dark:border-white/15 rounded-xl2 h-32 flex flex-col items-center justify-center gap-2 cursor-pointer text-ink-700 dark:text-white/50 hover:border-brand-500 transition-colors overflow-hidden">
              {preview ? <img src={preview} alt="preview" className="h-full w-full object-cover" /> : <><FiUploadCloud size={22} /><span className="text-xs">Click to upload a photo</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </Field>

          <button disabled={submitting} className="btn-primary mt-2">{submitting ? 'Listing donation…' : 'Submit Donation'}</button>
        </form>

        <div className="card p-6 h-fit">
          <h3 className="font-display font-semibold">AI NGO Matches</h3>
          <p className="text-xs text-ink-700 dark:text-white/50 mt-1">Ranked by distance, capacity, and rating once you submit.</p>
          <div className="mt-4 space-y-3">
            {!matches && <p className="text-sm text-ink-700 dark:text-white/40">Submit the form to see recommended NGOs.</p>}
            {matches?.map((n) => (
              <div key={n.id} className="rounded-xl2 border border-black/5 dark:border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">{n.name}</p>
                  <span className="badge bg-brand-500/10 text-brand-600 dark:text-brand-300">{n.matchScore}% match</span>
                </div>
                <p className="text-xs text-ink-700 dark:text-white/50 mt-1">{n.distanceKm} km away · ETA {n.etaMinutes} min</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-700 dark:text-white/60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
