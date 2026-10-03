import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiBell, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ title, navItems, children }) {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-brand-50/40 dark:bg-ink-900">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-white dark:bg-ink-800 border-r border-black/5 dark:border-white/10 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex items-center justify-between lg:hidden">
          <span className="font-display font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}><FiX /></button>
        </div>
        <div className="px-5 pb-4 hidden lg:block">
          <p className="text-xs uppercase tracking-wide text-ink-700 dark:text-white/40">Signed in as</p>
          <p className="font-semibold truncate">{user?.name}</p>
        </div>
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-500 text-white' : 'text-ink-700 dark:text-white/70 hover:bg-brand-500/10'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
          <button onClick={logout} className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 mt-4">
            <FiLogOut size={16} /> Logout
          </button>
        </nav>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="sticky top-16 z-20 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}><FiMenu size={20} /></button>
            <h1 className="font-display font-semibold text-xl">{title}</h1>
          </div>
          <button className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center relative">
            <FiBell size={16} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-clay-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
