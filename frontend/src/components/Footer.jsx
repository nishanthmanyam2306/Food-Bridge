import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <p className="font-display text-xl font-bold text-white">Food Bridge</p>
          <p className="mt-3 text-sm max-w-xs">Don't waste it. Donate it. Connecting surplus food with the people who need it — before it's too late.</p>
          <div className="flex gap-3 mt-5">
            {[FiInstagram, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Platform</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Get Started</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/signup?role=donor" className="hover:text-white">Donate Food</Link></li>
            <li><Link to="/signup?role=ngo" className="hover:text-white">Register NGO</Link></li>
            <li><Link to="/signup?role=volunteer" className="hover:text-white">Become Volunteer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} Food Bridge. Built to end plate-to-waste, one bridge at a time.
      </div>
    </footer>
  )
}
