const steps = [
  { title: 'Food donor uploads food', text: 'A restaurant, hotel, bakery, or event organizer lists surplus food with quantity, expiry, and pickup time.' },
  { title: 'AI matches nearest NGO', text: 'The engine scores nearby NGOs on distance, capacity, and rating, and surfaces the best match instantly.' },
  { title: 'NGO accepts', text: 'The NGO reviews and accepts the donation, or passes if it doesn\u2019t fit their current capacity.' },
  { title: 'Volunteer collects food', text: 'A nearby available volunteer is recommended and assigned to pick up the donation on a guided route.' },
  { title: 'Food delivered', text: 'The volunteer confirms delivery, the NGO confirms receipt, and the donation is marked completed.' },
]

export default function HowItWorks() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-20">
      <h1 className="text-4xl font-display font-semibold text-center">How it works</h1>
      <p className="text-center text-ink-700 dark:text-white/60 mt-3">From surplus to plate in five steps.</p>

      <div className="mt-16 relative">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-brand-500/20" />
        <div className="space-y-10">
          {steps.map((s, i) => (
            <div key={s.title} className="relative pl-16">
              <div className="absolute left-0 top-0 h-12 w-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-display font-semibold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-ink-700 dark:text-white/60 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
