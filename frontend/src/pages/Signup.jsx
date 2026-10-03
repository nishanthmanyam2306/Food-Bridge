import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiGift, FiUsers, FiTruck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const roles = [
  { id: 'donor', label: 'Food Donor', icon: FiGift, hint: 'Restaurant, hotel, bakery, supermarket, or event organizer' },
  { id: 'ngo', label: 'NGO', icon: FiUsers, hint: 'Accept and distribute donations to people in need' },
  { id: 'volunteer', label: 'Volunteer', icon: FiTruck, hint: 'Collect and deliver food between donors and NGOs' },
]

export default function Signup() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'donor')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await signup(email, password, role, name)
      toast.success('Account created — verification email sent')
      navigate(`/${role}/dashboard`)
    } catch (err) {
      toast.error(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="text-3xl font-display font-semibold text-center">Join the bridge</h1>
      <p className="text-center text-ink-700 dark:text-white/60 mt-2 text-sm">Choose how you'd like to help</p>

      <div className="grid gap-2 mt-8">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-4 rounded-xl2 p-4 border text-left transition-all ${
              role === r.id ? 'border-brand-500 bg-brand-500/10' : 'border-black/10 dark:border-white/15'
            }`}
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${role === r.id ? 'bg-brand-500 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
              <r.icon size={17} />
            </div>
            <div>
              <p className="font-medium text-sm">{r.label}</p>
              <p className="text-xs text-ink-700 dark:text-white/50">{r.hint}</p>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <input required placeholder="Full name / organization" value={name} onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <input required type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating account…' : 'Create account'}</button>
      </form>

      <p className="text-center text-sm text-ink-700 dark:text-white/60 mt-6">
        Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-300 font-medium">Log in</Link>
      </p>
    </div>
  )
}
