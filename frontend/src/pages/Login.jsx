import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiGift, FiUsers, FiTruck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const roles = [
  { id: 'donor', label: 'Food Donor', icon: FiGift },
  { id: 'ngo', label: 'NGO', icon: FiUsers },
  { id: 'volunteer', label: 'Volunteer', icon: FiTruck },
]

export default function Login() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'donor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, resetPassword } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password, role)
      toast.success(`Welcome back — logged in as ${role}`)
      navigate(`/${role}/dashboard`)
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot() {
    if (!email) return toast.error('Enter your email first')
    await resetPassword(email)
    toast.success('Password reset link sent (check your inbox)')
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="text-3xl font-display font-semibold text-center">Welcome back</h1>
      <p className="text-center text-ink-700 dark:text-white/60 mt-2 text-sm">Log in to your Food Bridge dashboard</p>

      <div className="grid grid-cols-3 gap-2 mt-8">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`flex flex-col items-center gap-2 rounded-xl2 py-4 border text-sm font-medium transition-all ${
              role === r.id ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'border-black/10 dark:border-white/15 text-ink-700 dark:text-white/60'
            }`}
          >
            <r.icon size={18} />
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <button type="button" onClick={handleForgot} className="text-xs text-brand-600 dark:text-brand-300 justify-self-end -mt-2">Forgot password?</button>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Logging in…' : `Log in as ${roles.find((r) => r.id === role).label}`}</button>
      </form>

      <p className="text-center text-sm text-ink-700 dark:text-white/60 mt-6">
        New here? <Link to="/signup" className="text-brand-600 dark:text-brand-300 font-medium">Create an account</Link>
      </p>

      <p className="text-center text-xs text-ink-700 dark:text-white/40 mt-4">
        Demo mode: any email/password logs you into a seeded {role} profile.
      </p>
    </div>
  )
}
