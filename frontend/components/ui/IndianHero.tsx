'use client'

/**
 * IndianHero — Indic animated hero (JanNiti v2.0).
 *
 * Ashoka-Chakra ring in the back (kept), floating scheme icons, and your
 * uploaded POSTER IMAGES shown large in animated motion (cross-fade + gentle
 * left-right drift). The old "Understand Every Government Scheme" headline is
 * removed — the posters are the hero now.
 *
 * Posters are read from /public/banners/  (banner1.png ... banner8.png).
 * Missing files are skipped. If none are present yet, a friendly prompt shows.
 */

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

const BANNER_CANDIDATES = [
  '/banners/banner1.png', '/banners/banner2.png', '/banners/banner3.png',
  '/banners/banner4.png', '/banners/banner5.png', '/banners/banner6.png',
  '/banners/banner7.png', '/banners/banner8.png',
]

const FLOATERS: { label: string; d: string; x: string; y: string; delay: string; color: string }[] = [
  { label: 'Farmer support',   d: 'M12 2l2 5h5l-4 3.5L16.5 16 12 13l-4.5 3L9 10.5 5 7h5z', x: '6%',  y: '20%', delay: '0s',   color: '#f59e0b' },
  { label: 'Scholarships',     d: 'M12 3L1 8l11 5 9-4.09V15h2V8L12 3zM5 12v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4l-7 3.18L5 12z', x: '88%', y: '16%', delay: '1.2s', color: '#22c55e' },
  { label: 'Business loans',   d: 'M12 4a3 3 0 013 3h2a5 5 0 00-10 0h2a3 3 0 013-3zm-7 6h14l-1.5 9h-11L5 10zm6 2v5h2v-5h-2z', x: '9%', y: '70%', delay: '2.1s', color: '#e2e8f0' },
  { label: 'Health cover',     d: 'M12 21s-7.5-4.7-9.7-9A5.6 5.6 0 0112 6.3 5.6 5.6 0 0121.7 12c-2.2 4.3-9.7 9-9.7 9zM11 8v3H8v2h3v3h2v-3h3v-2h-3V8h-2z', x: '85%', y: '68%', delay: '0.7s', color: '#f97316' },
]

export default function IndianHero() {
  const { t } = useI18n()
  const [images, setImages] = useState<string[]>([])
  const [idx, setIdx] = useState(0)

  // find which banner images actually exist
  useEffect(() => {
    let cancelled = false
    Promise.all(
      BANNER_CANDIDATES.map(
        (src) =>
          new Promise<string | null>((res) => {
            const im = new window.Image()
            im.onload = () => res(src)
            im.onerror = () => res(null)
            im.src = src
          }),
      ),
    ).then((r) => { if (!cancelled) setImages(r.filter((s): s is string => !!s)) })
    return () => { cancelled = true }
  }, [])

  // auto-advance the poster carousel
  useEffect(() => {
    if (images.length < 2) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(() => setIdx((p) => (p + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images])

  return (
    <section className="jn-hero relative overflow-hidden" aria-label="JanNiti">
      <style>{`
        .jn-hero { background:
          radial-gradient(60rem 30rem at 15% -10%, rgba(245,158,11,.14), transparent 60%),
          radial-gradient(60rem 30rem at 85% 110%, rgba(34,197,94,.14), transparent 60%),
          linear-gradient(180deg, #0b1220 0%, #0e1a33 100%); }
        .jn-chakra { animation: jn-spin 60s linear infinite; opacity:.14 }
        .jn-float { animation: jn-float 7s ease-in-out infinite; }
        .jn-fade-up { animation: jn-fade-up .9s ease-out both; }
        .jn-poster { animation: jn-poster-fade .8s ease-out, jn-poster-drift 9s ease-in-out infinite; }
        @keyframes jn-spin { to { transform: rotate(360deg); } }
        @keyframes jn-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes jn-fade-up { from { opacity:0; transform: translateY(18px);} to { opacity:1; transform:none; } }
        @keyframes jn-poster-fade { from { opacity:0; } to { opacity:1; } }
        @keyframes jn-poster-drift { 0%,100% { transform: translateX(0) scale(1); } 50% { transform: translateX(14px) scale(1.02); } }
        @media (prefers-reduced-motion: reduce) {
          .jn-chakra, .jn-float, .jn-fade-up, .jn-poster { animation: none !important; }
        }
      `}</style>

      {/* Ashoka-Chakra ring (kept, unchanged) */}
      <svg className="jn-chakra a11y-keep pointer-events-none absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 text-sky-300"
           viewBox="0 0 200 200" fill="none" aria-hidden>
        <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="10" fill="currentColor" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="100" y1="100"
                x2={100 + 86 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={100 + 86 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="currentColor" strokeWidth="1.4" />
        ))}
      </svg>

      {/* floating scheme icons */}
      {FLOATERS.map((f) => (
        <div key={f.label} className="jn-float pointer-events-none absolute hidden md:block"
             style={{ left: f.x, top: f.y, animationDelay: f.delay }} aria-hidden>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur" title={f.label}>
            <svg className="a11y-keep" width="28" height="28" viewBox="0 0 24 24" fill={f.color}><path d={f.d} /></svg>
          </div>
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:py-20">
        {/* Animated posters (replaces the old headline) */}
        {images.length > 0 ? (
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl">
            {/* FIX: posters are shown in FULL. The frame sizes itself to the
                first image (static, keeps layout height), and every image uses
                object-contain so nothing is cropped from the top/bottom. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]} alt="" aria-hidden className="invisible block h-auto w-full max-h-[80vh]" draggable={false} />
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="JanNiti government scheme highlight"
                className={`jn-poster absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
                draggable={false}
              />
            ))}
            {/* dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                  <button key={i} type="button" aria-label={`Show poster ${i + 1}`}
                    onClick={() => setIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-white/25 bg-white/5 px-6 py-16 text-center backdrop-blur">
            <div className="text-3xl">🇮🇳</div>
            <p className="mt-3 text-lg font-semibold text-white">Add your poster images to see them here</p>
            <p className="mt-2 text-sm text-slate-300">
              Save your images as <code className="rounded bg-black/40 px-1">banner1.png</code>,
              <code className="mx-1 rounded bg-black/40 px-1">banner2.png</code>…
              into <code className="rounded bg-black/40 px-1">frontend/public/banners/</code>, then refresh.
            </p>
          </div>
        )}

        {/* CTA buttons */}
        <div className="jn-fade-up mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/explainer"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
            🔍 {t('btn_search_scheme')}
          </Link>
          <Link href="/chatbot"
                className="rounded-xl border border-green-500/50 bg-green-500/10 px-7 py-3.5 font-semibold text-green-300 backdrop-blur transition hover:bg-green-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300">
            💬 {t('btn_ask_ai')}
          </Link>
        </div>
      </div>
    </section>
  )
}
