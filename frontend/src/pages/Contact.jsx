import { useState } from 'react'
import toast from 'react-hot-toast'

const faqs = [
  { q: 'How quickly is surplus food matched to an NGO?', a: 'The AI engine scores nearby NGOs the moment a donation is listed — matches typically surface within seconds.' },
  { q: 'Is there a minimum donation size?', a: 'No. Food Bridge accepts donations of any size, from a few meals to full event surplus.' },
  { q: 'How are volunteers verified?', a: 'Volunteers sign up with a verified profile and build a rating and delivery history over time.' },
  { q: 'What happens if no volunteer is available in time?', a: 'The system automatically expands the search radius and re-prioritizes based on the donation\u2019s expiry window.' },
]

export default function Contact() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="max-w-4xl mx-auto px-5 py-20">
      <h1 className="text-4xl font-display font-semibold text-center">Get in touch</h1>
      <p className="text-center text-ink-700 dark:text-white/60 mt-3">Questions, partnerships, or feedback — we'd love to hear from you.</p>

      <form
        className="mt-12 glass-panel p-6 grid gap-4"
        onSubmit={(e) => { e.preventDefault(); toast.success('Message sent — we\'ll reply soon.') }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <input required placeholder="Your name" className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
          <input required type="email" placeholder="Email address" className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        </div>
        <textarea required placeholder="How can we help?" rows={5} className="rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-4 py-3 focus-ring" />
        <button className="btn-primary justify-self-start">Send message</button>
      </form>

      <h2 className="text-2xl font-display font-semibold mt-20 mb-6">Frequently asked questions</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="card overflow-hidden">
            <button className="w-full text-left px-5 py-4 font-medium flex justify-between items-center" onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
              {f.q}
              <span className="text-brand-500">{openIdx === i ? '−' : '+'}</span>
            </button>
            {openIdx === i && <p className="px-5 pb-4 text-sm text-ink-700 dark:text-white/60">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
