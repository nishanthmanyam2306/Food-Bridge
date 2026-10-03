import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGift, FiUsers, FiTruck, FiTrendingUp, FiCloud, FiArrowRight, FiStar } from 'react-icons/fi'
import StatCard from '../components/StatCard'
import { fetchAnalytics } from '../services/api'

export default function Landing() {
  const [stats, setStats] = useState(null)

  useEffect(() => { fetchAnalytics().then(setStats) }, [])

  return (
    <div>
      <Hero />
      <Stats stats={stats} />
      <Workflow />
      <Testimonials />
      <ContactSection />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white dark:from-ink-800 dark:via-ink-900 dark:to-ink-900">
      <div className="max-w-7xl mx-auto px-5 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="badge bg-clay-500/10 text-clay-600 dark:text-clay-400 mb-5">Intelligent Food Redistribution</span>
          <h1 className="text-5xl lg:text-6xl font-display font-semibold leading-[1.05]">
            Food Bridge
          </h1>
          <p className="mt-4 text-xl text-ink-700 dark:text-white/70 font-display">An Intelligent Food Redistribution Platform</p>
          <p className="mt-3 text-lg text-clay-600 dark:text-clay-400 font-semibold">"Don't Waste It. Donate It."</p>
          <p className="mt-5 text-ink-700 dark:text-white/60 max-w-md">
            Surplus food from restaurants, hotels, and events reaches the people who need it most —
            matched by AI, delivered by volunteers, before a single plate goes to waste.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup?role=donor" className="btn-accent">Donate Food <FiGift /></Link>
            <Link to="/signup?role=ngo" className="btn-primary">Need Food <FiArrowRight /></Link>
            <Link to="/signup?role=volunteer" className="btn-outline">Become Volunteer</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <BridgeIllustration />
        </motion.div>
      </div>
    </section>
  )
}

/** Signature element: an animated flow-path showing donor -> AI match -> NGO -> volunteer -> recipient */
function BridgeIllustration() {
  return (
    <div className="glass-panel p-8 relative">
      <svg viewBox="0 0 480 300" className="w-full h-auto">
        <path d="M20 240 C 120 40, 360 40, 460 240" stroke="#2E7D32" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="1000" className="animate-flow" opacity="0.5" />
        {[
          { x: 20, y: 240, label: 'Donor', color: '#2E7D32' },
          { x: 165, y: 90, label: 'AI Match', color: '#E8792E' },
          { x: 315, y: 90, label: 'NGO', color: '#2E7D32' },
          { x: 460, y: 240, label: 'Recipient', color: '#E8792E' },
        ].map((n, i) => (
          <g key={i} className="animate-floatUp" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx={n.x} cy={n.y} r="26" fill={n.color} opacity="0.15" />
            <circle cx={n.x} cy={n.y} r="14" fill={n.color} />
            <text x={n.x} y={n.y + 45} textAnchor="middle" fontSize="13" fontFamily="Sora" fill="currentColor" className="text-ink-800 dark:text-white">{n.label}</text>
          </g>
        ))}
      </svg>
      <p className="text-center text-sm text-ink-700 dark:text-white/50 mt-2">Every donation crosses this bridge in minutes, not hours.</p>
    </div>
  )
}

function Stats({ stats }) {
  const items = [
    { icon: FiGift, label: 'Meals Saved', value: stats?.mealsSaved?.toLocaleString() ?? '—' },
    { icon: FiTrendingUp, label: 'Food Waste Reduced (kg)', value: stats?.foodSavedKg?.toLocaleString() ?? '—', accent: 'clay' },
    { icon: FiUsers, label: 'People Fed', value: stats?.peopleFed?.toLocaleString() ?? '—' },
    { icon: FiGift, label: 'Registered Donors', value: stats?.registeredDonors ?? '—', accent: 'clay' },
    { icon: FiUsers, label: 'NGOs Onboard', value: stats?.registeredNgos ?? '—' },
    { icon: FiTruck, label: 'Volunteers', value: stats?.registeredVolunteers ?? '—', accent: 'clay' },
  ]
  return (
    <section className="max-w-7xl mx-auto px-5 -mt-8 relative z-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it) => <StatCard key={it.label} {...it} />)}
      </div>
    </section>
  )
}

function Workflow() {
  const steps = [
    { title: 'Donor uploads surplus food', icon: FiGift },
    { title: 'AI matches nearest NGO', icon: FiTrendingUp },
    { title: 'NGO accepts the donation', icon: FiUsers },
    { title: 'Volunteer collects & delivers', icon: FiTruck },
    { title: 'Delivery confirmed, impact logged', icon: FiCloud },
  ]
  return (
    <section className="max-w-7xl mx-auto px-5 py-24">
      <h2 className="text-3xl font-display font-semibold text-center">How the bridge works</h2>
      <p className="text-center text-ink-700 dark:text-white/60 mt-2 max-w-xl mx-auto">Five steps, powered by real-time matching — from kitchen to plate.</p>
      <div className="mt-14 grid md:grid-cols-5 gap-6">
        {steps.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
              <s.icon size={22} />
            </div>
            <p className="text-sm font-medium">{s.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const quotes = [
    { name: 'Meera R.', role: 'NGO Coordinator, Anna Seva Foundation', text: 'We used to miss donations because we heard about them too late. Now we get matched within minutes of surplus being listed.' },
    { name: 'Vikram S.', role: 'Restaurant Owner', text: 'Listing surplus food takes less than a minute, and I can see exactly which meals reached which shelter.' },
    { name: 'Priya N.', role: 'Volunteer, 78 deliveries', text: 'The route suggestions and pickup reminders make it easy to fit deliveries around my day job.' },
  ]
  return (
    <section className="bg-brand-50 dark:bg-ink-800 py-24">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-display font-semibold text-center">Voices from the bridge</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <div key={q.name} className="card p-6">
              <div className="flex gap-1 text-clay-500 mb-3">{Array.from({ length: 5 }).map((_, i) => <FiStar key={i} fill="currentColor" size={14} />)}</div>
              <p className="text-sm text-ink-700 dark:text-white/70">"{q.text}"</p>
              <p className="mt-4 text-sm font-semibold">{q.name}</p>
              <p className="text-xs text-ink-700 dark:text-white/50">{q.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="max-w-3xl mx-auto px-5 py-24 text-center">
      <h2 className="text-3xl font-display font-semibold">Have a question?</h2>
      <p className="text-ink-700 dark:text-white/60 mt-2">Reach out and our team will get back to you within a day.</p>
      <form className="mt-8 glass-panel p-6 grid gap-4 text-left" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <input required placeholder="Your name" className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
          <input required type="email" placeholder="Email address" className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        </div>
        <textarea required placeholder="Message" rows={4} className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <button className="btn-primary justify-self-start">Send message</button>
        {sent && <p className="text-sm text-brand-600 dark:text-brand-300">Thanks — we'll be in touch soon.</p>}
      </form>
    </section>
  )
}
