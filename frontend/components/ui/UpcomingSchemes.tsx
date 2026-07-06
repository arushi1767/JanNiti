'use client'

/**
 * UpcomingSchemes — "New & Upcoming Schemes" tracker (JanNiti v2.0).
 * A drop-in replacement for the old "Impact Dashboard" numbers section,
 * which showed placeholder ("Illustrative — not live data") figures.
 *
 * This shows real, recently launched / announced central schemes with their
 * status, launch date, ministry and official link — useful and honest, no
 * fake statistics. Data is a static, verified list (update it as new schemes
 * launch); it needs no backend call, so it renders instantly.
 *
 * Usage — in frontend/app/dashboard/page.tsx (your "Impact" page), replace the
 * stats/section content with:
 *
 *     import UpcomingSchemes from '@/components/ui/UpcomingSchemes'
 *     ...
 *     <UpcomingSchemes />
 */

import { useMemo, useState } from 'react'

type Status = 'Live' | 'Rolling out' | 'Announced'
type Cat = 'Agriculture' | 'Education' | 'Employment' | 'Health' | 'Finance'

interface SchemeNews {
  name: string
  short: string
  status: Status
  date: string          // human-readable launch/announce date
  ministry: string
  category: Cat
  official: string
}

// Verified from official/government sources (pmindia.gov.in, Union Budget
// 2025-26). Keep this list current as new schemes are notified.
const SCHEMES: SchemeNews[] = [
  {
    name: 'PM Dhan-Dhaanya Krishi Yojana',
    short: 'Develops 100 low-productivity agri districts (crop diversification, storage, irrigation, credit) for ~1.7 crore farmers. Outlay ₹24,000 crore.',
    status: 'Rolling out', date: 'Launched 11 Oct 2025', category: 'Agriculture',
    ministry: 'Agriculture & Farmers Welfare', official: 'https://www.pmindia.gov.in',
  },
  {
    name: 'Mission for Aatmanirbharta in Pulses',
    short: 'Six-year mission to make India self-sufficient in pulses by 2030-31 via better seeds, more acreage and stronger procurement. Outlay ₹11,440 crore.',
    status: 'Rolling out', date: 'Launched 11 Oct 2025', category: 'Agriculture',
    ministry: 'Agriculture & Farmers Welfare', official: 'https://www.pmindia.gov.in',
  },
  {
    name: 'PM Vidyalakshmi Yojana',
    short: 'Collateral-free, guarantor-free education loans for meritorious students through a single digital platform, with interest subvention.',
    status: 'Live', date: 'Effective 1 Jan 2025', category: 'Education',
    ministry: 'Education', official: 'https://www.vidyalakshmi.co.in',
  },
  {
    name: "PM Internship Scheme",
    short: '12-month internships in top companies for youth (21-24), with a monthly stipend and one-time grant, to build real work experience.',
    status: 'Rolling out', date: 'Launched 3 Oct 2024', category: 'Employment',
    ministry: 'Corporate Affairs', official: 'https://pminternship.mca.gov.in',
  },
  {
    name: 'Ayushman Bharat Vaya Vandana Yojana',
    short: 'Extends Ayushman Bharat health cover to all senior citizens aged 70+, regardless of income, with a dedicated card.',
    status: 'Live', date: 'Launched 29 Oct 2024', category: 'Health',
    ministry: 'Health & Family Welfare', official: 'https://pmjay.gov.in',
  },
  {
    name: 'One Nation One Subscription',
    short: 'Nationwide access to academic journals and research publications for students and researchers across government institutions.',
    status: 'Live', date: 'Effective 1 Jan 2025', category: 'Education',
    ministry: 'Education', official: 'https://www.education.gov.in',
  },
]

const STATUS_STYLE: Record<Status, string> = {
  'Live': 'bg-green-500/15 text-green-400 border-green-500/40',
  'Rolling out': 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  'Announced': 'bg-sky-500/15 text-sky-400 border-sky-500/40',
}

const CAT_ICON: Record<Cat, string> = {
  Agriculture: '🌾', Education: '🎓', Employment: '💼', Health: '❤️', Finance: '🏦',
}

const FILTERS: Array<Cat | 'All'> = ['All', 'Agriculture', 'Education', 'Employment', 'Health']

export default function UpcomingSchemes() {
  const [filter, setFilter] = useState<Cat | 'All'>('All')
  const list = useMemo(
    () => (filter === 'All' ? SCHEMES : SCHEMES.filter((s) => s.category === filter)),
    [filter],
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          New &amp; Upcoming
        </div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">New &amp; Upcoming Government Schemes</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          The latest central schemes citizens should know about — what they do, their status, and where to apply.
        </p>
      </div>

      {/* filters */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f} type="button" onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition
              ${filter === f
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                : 'border-slate-600/60 bg-slate-800/40 text-slate-300 hover:border-slate-400'}`}
          >
            {f === 'All' ? 'All' : `${CAT_ICON[f as Cat]} ${f}`}
          </button>
        ))}
      </div>

      {/* cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <article
            key={s.name}
            className="group flex flex-col rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="text-2xl" aria-hidden>{CAT_ICON[s.category]}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[s.status]}`}>
                {s.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">{s.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{s.short}</p>
            <div className="mt-4 space-y-1 border-t border-slate-700/60 pt-3 text-xs text-slate-400">
              <div>📅 {s.date}</div>
              <div>🏛️ {s.ministry}</div>
            </div>
            <a
              href={s.official} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-600/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Official portal ↗
            </a>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Details are from official government announcements and may change — always confirm on the official portal before applying.
      </p>
    </section>
  )
}
