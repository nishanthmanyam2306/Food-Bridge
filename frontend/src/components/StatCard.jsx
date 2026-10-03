import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, suffix = '', accent = 'brand' }) {
  const ring = accent === 'clay' ? 'text-clay-500 bg-clay-500/10' : 'text-brand-500 bg-brand-500/10'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 flex items-center gap-4"
    >
      <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${ring}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <p className="text-2xl font-display font-semibold">{value}{suffix}</p>
        <p className="text-sm text-ink-700 dark:text-white/60">{label}</p>
      </div>
    </motion.div>
  )
}
