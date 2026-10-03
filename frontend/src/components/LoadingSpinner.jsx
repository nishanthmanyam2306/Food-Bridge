export default function LoadingSpinner({ fullscreen = false, label = 'Loading' }) {
  const wrap = fullscreen
    ? 'min-h-screen flex items-center justify-center bg-white dark:bg-ink-900'
    : 'flex items-center justify-center py-12'
  return (
    <div className={wrap}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-4 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
        </div>
        <span className="text-sm text-ink-700 dark:text-white/60">{label}…</span>
      </div>
    </div>
  )
}
