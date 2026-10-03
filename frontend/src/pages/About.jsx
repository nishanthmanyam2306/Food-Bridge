import { motion } from 'framer-motion'
import { FiTarget, FiHeart, FiZap } from 'react-icons/fi'

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-20">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-display font-semibold text-center">
        Every day, edible food goes to waste while people go hungry.
      </motion.h1>
      <p className="text-center text-ink-700 dark:text-white/60 mt-4 max-w-2xl mx-auto">
        Restaurants, hotels, supermarkets, and event organizers discard perfectly good food daily.
        Food Bridge closes that gap with an intelligent ecosystem connecting donors, NGOs, and volunteers.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {[
          { icon: FiTarget, title: 'Our Mission', text: 'Reduce food waste by connecting donors, NGOs, and volunteers so surplus food reaches people in need before it expires.' },
          { icon: FiZap, title: 'Powered by AI', text: 'Smart matching recommends the nearest NGO, prioritizes food by expiry, and predicts surplus trends.' },
          { icon: FiHeart, title: 'Built on Trust', text: 'Verified donors, rated NGOs, and tracked volunteers keep every donation transparent end-to-end.' },
        ].map((c) => (
          <div key={c.title} className="card p-6">
            <div className="h-11 w-11 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4"><c.icon size={20} /></div>
            <h3 className="font-display font-semibold text-lg">{c.title}</h3>
            <p className="text-sm text-ink-700 dark:text-white/60 mt-2">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-10 mt-16 text-center">
        <h2 className="text-2xl font-display font-semibold">Three roles. One bridge.</h2>
        <p className="text-ink-700 dark:text-white/60 mt-2 max-w-2xl mx-auto">
          Food Donors list surplus meals in under a minute. NGOs accept and manage incoming donations.
          Volunteers collect and deliver — guided by live routes and pickup confirmations.
        </p>
      </div>
    </div>
  )
}
