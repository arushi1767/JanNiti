'use client'

/**
 * SchemeShowcase — animated Indic illustration carousel (JanNiti v2.0).
 *
 * MyScheme-style hero band: an auto-rotating set of scheme "scenes" (farmer,
 * student, woman entrepreneur, senior citizen, worker), each drawn as an
 * animated inline SVG illustration in Indian tricolor tones — no external or
 * copyrighted photos, so it always loads and never breaks. Below it sits a
 * MyScheme-style stats strip.
 *
 * Drop-in — put it on the home page under the hero:
 *
 *     import SchemeShowcase from '@/components/ui/SchemeShowcase'
 *     ...
 *     <SchemeShowcase />
 *
 * Respects prefers-reduced-motion and the accessibility panel's Pause Animation
 * (both stop the auto-rotation transition; you can still click the dots).
 */

import { useEffect, useState } from 'react'

interface Scene {
  title: string
  caption: string
  accent: string
  svg: React.ReactNode
}

const SCENES: Scene[] = [
  {
    title: 'Support for Farmers',
    caption: 'Income support, crop insurance and easy credit — PM-KISAN, PMFBY, KCC.',
    accent: '#22c55e',
    svg: (
      <g>
        <rect x="20" y="150" width="260" height="40" fill="#16a34a" opacity="0.25" />
        <path d="M40 150 q10 -40 20 0" stroke="#22c55e" strokeWidth="3" fill="none" />
        <path d="M70 150 q10 -50 20 0" stroke="#22c55e" strokeWidth="3" fill="none" />
        <path d="M100 150 q10 -40 20 0" stroke="#22c55e" strokeWidth="3" fill="none" />
        <circle cx="200" cy="95" r="18" fill="#f59e0b" />
        <rect x="190" y="110" width="20" height="40" rx="6" fill="#0ea5e9" />
        <circle cx="200" cy="60" r="26" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
      </g>
    ),
  },
  {
    title: 'Scholarships for Students',
    caption: 'Merit and single-girl-child scholarships, education & skill loans.',
    accent: '#38bdf8',
    svg: (
      <g>
        <path d="M150 70 l60 22 -60 22 -60 -22 z" fill="#f59e0b" />
        <path d="M150 92 v26" stroke="#e2e8f0" strokeWidth="3" />
        <rect x="120" y="120" width="60" height="45" rx="6" fill="#0ea5e9" />
        <circle cx="150" cy="112" r="9" fill="#fde68a" />
        <path d="M210 92 v20" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="210" cy="116" r="4" fill="#f59e0b" />
      </g>
    ),
  },
  {
    title: 'Women Entrepreneurs',
    caption: 'Business loans and enterprise support — MUDRA, Stand-Up India.',
    accent: '#f472b6',
    svg: (
      <g>
        <circle cx="150" cy="80" r="16" fill="#fbbf24" />
        <path d="M134 96 q16 24 32 0 l6 54 h-44 z" fill="#ec4899" />
        <rect x="120" y="150" width="60" height="10" rx="4" fill="#0ea5e9" />
        <path d="M186 120 l14 -14 m0 0 h-9 m9 0 v9" stroke="#22c55e" strokeWidth="3" fill="none" />
      </g>
    ),
  },
  {
    title: 'Security for Seniors',
    caption: 'Pension and insurance — Atal Pension, PMJJBY, PMSBY.',
    accent: '#fbbf24',
    svg: (
      <g>
        <circle cx="150" cy="82" r="16" fill="#fcd34d" />
        <path d="M132 100 q18 20 36 0 l6 50 h-48 z" fill="#0ea5e9" />
        <path d="M150 150 v22" stroke="#94a3b8" strokeWidth="3" />
        <circle cx="150" cy="150" r="30" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.7" />
        <path d="M138 150 l8 8 16 -18" stroke="#22c55e" strokeWidth="3" fill="none" />
      </g>
    ),
  },
  {
    title: 'Jobs & Skills for Youth',
    caption: 'Employment incentives and skilling — PM-VBRY, PMKVY.',
    accent: '#a78bfa',
    svg: (
      <g>
        <rect x="110" y="110" width="80" height="50" rx="8" fill="#7c3aed" opacity="0.85" />
        <rect x="122" y="122" width="56" height="8" rx="4" fill="#e2e8f0" />
        <rect x="122" y="136" width="40" height="8" rx="4" fill="#c4b5fd" />
        <circle cx="150" cy="86" r="15" fill="#fbbf24" />
        <path d="M175 100 l10 -10 m0 0 h-7 m7 0 v7" stroke="#22c55e" strokeWidth="3" fill="none" />
      </g>
    ),
  },
]

export default function SchemeShowcase() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(() => setI((p) => (p + 1) % SCENES.length), 3500)
    return () => clearInterval(id)
  }, [])

  const s = SCENES[i]

  return (
    <section className="mx-auto max-w-5xl px-4 py-12" aria-label="Government scheme highlights">
      <style>{`
        @keyframes ss-fade { from { opacity:0; transform: translateY(10px) scale(.98);} to { opacity:1; transform:none;} }
        @keyframes ss-bob  { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
        .ss-scene { animation: ss-fade .6s ease-out; }
        .ss-art   { animation: ss-bob 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .ss-scene,.ss-art{ animation:none!important; } }
      `}</style>

      <div className="overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl">
        <div className="grid items-center gap-6 md:grid-cols-2">
          {/* illustration */}
          <div className="ss-scene flex justify-center" key={i}>
            <svg className="ss-art a11y-keep h-64 w-full max-w-sm" viewBox="0 0 300 200" role="img" aria-label={s.title}>
              <defs>
                <radialGradient id="ss-glow" cx="50%" cy="45%" r="60%">
                  <stop offset="0%" stopColor={s.accent} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={s.accent} stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="300" height="200" fill="url(#ss-glow)" />
              {/* tricolor ground line */}
              <rect x="20" y="188" width="86" height="4" fill="#f59e0b" rx="2" />
              <rect x="107" y="188" width="86" height="4" fill="#f8fafc" rx="2" />
              <rect x="194" y="188" width="86" height="4" fill="#16a34a" rx="2" />
              {s.svg}
            </svg>
          </div>

          {/* text */}
          <div className="ss-scene" key={`t-${i}`}>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: `${s.accent}22`, color: s.accent }}>
              Digital India · Schemes for You
            </span>
            <h3 className="mt-3 text-2xl font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-slate-300">{s.caption}</p>
          </div>
        </div>

        {/* dots */}
        <div className="mt-6 flex justify-center gap-2">
          {SCENES.map((_, idx) => (
            <button
              key={idx} type="button" aria-label={`Show ${SCENES[idx].title}`}
              onClick={() => setI(idx)}
              className={`h-2.5 rounded-full transition-all ${idx === i ? 'w-7 bg-indigo-400' : 'w-2.5 bg-slate-600 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
