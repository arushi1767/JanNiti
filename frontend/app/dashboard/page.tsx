'use client'

/**
 * Impact page — JanNiti v2.0.
 * Replaces the old placeholder "beneficiaries / funds disbursed" numbers
 * (which showed "Illustrative — not live data") with a real, working
 * "New & Upcoming Schemes" tracker. No backend call, always loads.
 */

import UpcomingSchemes from '@/components/ui/UpcomingSchemes'

export default function DashboardPage() {
  return (
    <div>
      <div className="tricolor-bar w-full" style={{ borderRadius: 0 }} />
      <UpcomingSchemes />
    </div>
  )
}
