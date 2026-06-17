'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { compareSchemes, searchSchemes } from '@/lib/api'
import { GitCompare, Loader2, ArrowRightLeft, CheckCircle2, AlertTriangle, Info, ExternalLink } from 'lucide-react'

export default function ComparePage() {
  const [scheme1, setScheme1] = useState('')
  const [scheme2, setScheme2] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [suggestions1, setSuggestions1] = useState<any[]>([])
  const [suggestions2, setSuggestions2] = useState<any[]>([])

  const handleCompare = async () => {
    if (!scheme1.trim() || !scheme2.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await compareSchemes(scheme1.trim(), scheme2.trim())
      setResult(res)
    } catch (err) {
      console.error('Compare API error:', err)
      setError('Failed to compare schemes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch1 = async (val: string) => {
    setScheme1(val)
    if (val.length > 2) {
      const res = await searchSchemes(val)
      setSuggestions1(res.results || [])
    } else setSuggestions1([])
  }

  const handleSearch2 = async (val: string) => {
    setScheme2(val)
    if (val.length > 2) {
      const res = await searchSchemes(val)
      setSuggestions2(res.results || [])
    } else setSuggestions2([])
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Compare Policies
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Side-by-side comparison of any two government schemes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Input
            value={scheme1}
            onChange={(e) => handleSearch1(e.target.value)}
            placeholder="First scheme... e.g., PM Kisan"
            className="text-lg"
            id="scheme1"
            label="Scheme 1"
          />
          {suggestions1.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {suggestions1.map((s: any, i: number) => (
                <button key={i} onClick={() => { setScheme1(s.name); setSuggestions1([]) }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b last:border-0">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{s.ministry}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <Input
            value={scheme2}
            onChange={(e) => handleSearch2(e.target.value)}
            placeholder="Second scheme... e.g., Ayushman Bharat"
            className="text-lg"
            id="scheme2"
            label="Scheme 2"
          />
          {suggestions2.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {suggestions2.map((s: any, i: number) => (
                <button key={i} onClick={() => { setScheme2(s.name); setSuggestions2([]) }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b last:border-0">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{s.ministry}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <Button onClick={handleCompare} disabled={loading || !scheme1.trim() || !scheme2.trim()} size="lg" className="px-10">
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowRightLeft className="w-5 h-5 mr-2" />}
          {loading ? 'Comparing...' : 'Compare Schemes'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Analyzing and comparing schemes...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-safron-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4 text-center">
              <div className="flex-1 font-bold text-lg text-gray-900 dark:text-gray-100">{result.scheme1_name}</div>
              <div className="flex items-center gap-2 text-primary-600">
                <ArrowRightLeft className="w-6 h-6" />
                <span className="text-sm font-medium">VS</span>
              </div>
              <div className="flex-1 font-bold text-lg text-gray-900 dark:text-gray-100">{result.scheme2_name}</div>
            </div>
          </div>

          {/* Comparison Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 w-1/4">Aspect</th>
                    <th className="text-left px-4 py-3 font-semibold text-primary-700 dark:text-primary-400 w-[37.5%]">{result.scheme1_name}</th>
                    <th className="text-left px-4 py-3 font-semibold text-safron-700 dark:text-safron-400 w-[37.5%]">{result.scheme2_name}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparisons?.map((comp: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 align-top">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary-500 shrink-0" />
                          {comp.aspect}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{comp.scheme1_value}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{comp.scheme2_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recommendation */}
          {result.recommendation && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-green-200 dark:border-green-800">
              <CardTitle className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                Recommendation
              </CardTitle>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{result.recommendation}</p>
              </CardContent>
            </Card>
          )}

          {(!result.comparisons || result.comparisons.length === 0) && (
            <Card>
              <CardContent>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Could not generate comparison. Please try different scheme names.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
