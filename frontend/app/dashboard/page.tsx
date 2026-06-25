'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getDashboardStats } from '@/lib/api'
import { Loader2, Users, IndianRupee, MapPin, Shield, Award, Activity } from 'lucide-react'

interface DashboardData {
  total_beneficiaries: string
  total_funds_disbursed: string
  state_coverage: { state: string; schemes: number; beneficiaries: string }[]
  last_updated: string
  source: string
  top_schemes?: { name: string; beneficiaries: string; funds: string }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getDashboardStats()
      setData(res)
    } catch (err) {
      console.error('Dashboard API error:', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading impact data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Impact Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Real-time statistics on government scheme reach and impact
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Beneficiaries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{data.total_beneficiaries}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Funds Disbursed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{data.total_funds_disbursed}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-safron-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{data.last_updated}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Schemes */}
          {data.top_schemes && (
            <div>
              <h2 className="section-title mb-4">Top Schemes by Reach</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.top_schemes.map((scheme, i) => (
                  <Card key={i} className="border-l-4 border-l-primary-500">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{scheme.name}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <Users className="w-3 h-3 inline mr-1" />
                            {scheme.beneficiaries}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <IndianRupee className="w-3 h-3 inline mr-1" />
                            {scheme.funds}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* State Coverage */}
          <div>
            <h2 className="section-title mb-4">State-wise Coverage</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">State</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Schemes Active</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Beneficiaries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.state_coverage?.map((s, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <MapPin className="w-3.5 h-3.5 inline mr-1.5 text-primary-500" />
                          {s.state}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.schemes} schemes</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.beneficiaries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Source */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <Shield className="w-4 h-4" />
            Source: {data.source}
          </div>
        </div>
      )}
    </div>
  )
}
