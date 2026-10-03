import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const dashboardPath = user ? `/${user.role}/dashboard` : '/login'

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-ink-900/80 border-b border-black/5 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <BridgeMark />
          Food Bridge
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) =>
              `hover:text-brand-500 transition-colors ${isActive ? 'text-brand-500' : 'text-ink-800 dark:text-white/80'}`
            }>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => setDark((d) => !d)} className="focus-ring h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10" aria-label="Toggle dark mode">
            {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
          {user ? (
            <Link to={dashboardPath} className="btn-primary text-sm px-5 py-2.5">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm px-5 py-2.5">Login</Link>
              <Link to="/signup" className="btn-accent text-sm px-5 py-2.5">Donate Food</Link>
            </>
          )}
        </div>

        <button className="lg:hidden focus-ring" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden px-5 pb-5 flex flex-col gap-4 border-t border-black/5 dark:border-white/10 pt-4">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium">{l.label}</NavLink>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <Link to={dashboardPath} className="btn-primary text-sm flex-1">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm flex-1">Login</Link>
                <Link to="/signup" className="btn-accent text-sm flex-1">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function BridgeMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M4 22C8 14 12 14 16 22C20 14 24 14 28 22" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="8" r="3.5" fill="#E8792E" />
    </svg>
  )
}
