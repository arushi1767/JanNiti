'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VoiceButton } from '@/components/ui/VoiceButton'
import { SourceBadge } from '@/components/ui/SourceBadge'
import { explainScheme, detectConditions, getELI5, searchSchemes } from '@/lib/api'
import {
  Search, Loader2, AlertTriangle, CheckCircle2, Info,
  FileText, BookOpen, Lightbulb, Users, FileCheck,
  ClipboardList, CalendarClock, HelpCircle, ChevronDown,
  ChevronUp, Volume2, Sparkles, Shield, AlertOctagon
} from 'lucide-react'

interface SchemeResult {
  title: string
  what_is: string
  why_introduced: string
  benefits: string[]
  eligibility: string[]
  documents: string[]
  how_to_apply: string
  deadlines: string | null
  misunderstood_clauses: string[]
  source: string
  ministry: string
  last_updated: string
  confidence: string
  disclaimer: string
}

interface Condition {
  text: string
  severity: 'green' | 'yellow' | 'red'
  explanation: string
}

interface ELI5Result {
  story: string
  simple_explanation: string
  everyday_example: string
  key_takeaway: string
}

function SeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case 'red': return <AlertOctagon className="w-5 h-5 text-alert-red" />
    case 'yellow': return <AlertTriangle className="w-5 h-5 text-alert-yellow" />
    default: return <Info className="w-5 h-5 text-alert-green" />
  }
}

export default function ExplainerPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showELI5, setShowELI5] = useState(false)
  const [showConditions, setShowConditions] = useState(false)
  const [activeTab, setActiveTab] = useState<'explain' | 'eli5' | 'conditions'>('explain')

  const [result, setResult] = useState<SchemeResult | null>(null)
  const [eli5, setEli5] = useState<ELI5Result | null>(null)
  const [conditions, setConditions] = useState<{ conditions: Condition[], summary: string } | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setEli5(null)
    setConditions(null)

    try {
      const [explainResult, condResult, eli5Result] = await Promise.all([
        explainScheme({ query: query.trim(), language: 'en' }),
        detectConditions({ query: query.trim(), language: 'en' }),
        getELI5({ query: query.trim(), language: 'en' }),
      ])
      setResult(explainResult)
      setConditions(condResult)
      setEli5(eli5Result)
    } catch (err) {
      console.error('Explainer API error:', err)
      setError('Failed to fetch explanation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQueryChange = async (value: string) => {
    setQuery(value)
    if (value.length > 2) {
      try {
        const res = await searchSchemes(value)
        setSuggestions(res.results || [])
      } catch { setSuggestions([]) }
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = (name: string) => {
    setQuery(name)
    setSuggestions([])
  }

  const handleVoiceTranscript = (text: string) => {
    setQuery(text)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Policy Explainer
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Search any central or state government scheme. Get a simple explanation.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <div className="flex gap-3 items-start">
          <div className="flex-1 relative">
            <Input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search a scheme... e.g., PM Kisan, Ayushman Bharat, MGNREGA"
              className="pl-12 text-lg py-4"
              id="scheme-search"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto">
                {suggestions.map((s: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestion(s.name)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{s.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{s.ministry}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <VoiceButton onTranscript={handleVoiceTranscript} className="shrink-0" />
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={handleSearch} disabled={loading || !query.trim()} size="lg" className="px-10">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
            {loading ? 'Researching...' : 'Explain Scheme'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Analyzing scheme information...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Title */}
          <div className="bg-gradient-to-r from-primary-50 to-safron-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary-600 mt-1 shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{result.title}</h2>
                <SourceBadge
                  source={result.source}
                  ministry={result.ministry}
                  lastUpdated={result.last_updated}
                  confidence={result.confidence}
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            {[
              { id: 'explain', label: 'Explanation', icon: FileText },
              { id: 'eli5', label: 'Simple Story', icon: BookOpen },
              { id: 'conditions', label: 'Hidden Conditions', icon: AlertTriangle },
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Explanation Tab */}
          {activeTab === 'explain' && (
            <div className="space-y-6">
              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-primary-600" />
                  What is this scheme?
                </CardTitle>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{result.what_is}</p>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-safron-600" />
                  Why was it introduced?
                </CardTitle>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.why_introduced}</p>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  What benefits do you get?
                </CardTitle>
                <CardContent>
                  <ul className="space-y-2">
                    {result.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  Who is eligible?
                </CardTitle>
                <CardContent>
                  <ul className="space-y-2">
                    {result.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <Users className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  Required Documents
                </CardTitle>
                <CardContent>
                  <ul className="space-y-2">
                    {result.documents.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <FileCheck className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-5 h-5 text-teal-600" />
                  How to Apply
                </CardTitle>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.how_to_apply}</p>
                </CardContent>
              </Card>

              {result.deadlines && (
                <Card>
                  <CardTitle className="flex items-center gap-2 mb-3">
                    <CalendarClock className="w-5 h-5 text-orange-600" />
                    Deadlines
                  </CardTitle>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{result.deadlines}</p>
                  </CardContent>
                </Card>
              )}

              {result.misunderstood_clauses.length > 0 && (
                <Card>
                  <CardTitle className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-red-600" />
                    Frequently Misunderstood Clauses
                  </CardTitle>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.misunderstood_clauses.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
                {result.disclaimer}
              </div>
            </div>
          )}

          {/* ELI5 Tab */}
          {activeTab === 'eli5' && eli5 && (
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 border-green-200 dark:border-green-800">
                <CardTitle className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                  <BookOpen className="w-5 h-5" />
                  A Simple Story
                </CardTitle>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                    &ldquo;{eli5.story}&rdquo;
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardTitle className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  In Simple Words
                </CardTitle>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {eli5.simple_explanation}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/10">
                <CardTitle className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                  Everyday Example
                </CardTitle>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {eli5.everyday_example}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <CardTitle className="flex items-center gap-2 mb-3 text-primary-700 dark:text-primary-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Key Takeaway
                </CardTitle>
                <CardContent>
                  <p className="text-gray-800 dark:text-gray-200 text-xl font-semibold">
                    {eli5.key_takeaway}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Conditions Tab */}
          {activeTab === 'conditions' && conditions && (
            <div className="space-y-6 animate-fade-in">
              {conditions.summary && (
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <CardTitle className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    Summary of Key Risks
                  </CardTitle>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{conditions.summary}</p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {conditions.conditions?.map((cond, i) => {
                  const severityColors = {
                    green: 'border-l-green-500 bg-green-50 dark:bg-green-900/10',
                    yellow: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
                    red: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
                  }
                  const severityLabels = {
                    green: 'General Info',
                    yellow: 'Read Carefully',
                    red: 'Important Alert',
                  }
                  return (
                    <div
                      key={i}
                      className={`border-l-4 rounded-lg p-4 ${severityColors[cond.severity] || severityColors.green}`}
                    >
                      <div className="flex items-start gap-3">
                        <SeverityIcon severity={cond.severity} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={cond.severity as any}>
                              {severityLabels[cond.severity]}
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{cond.text}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cond.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {(!conditions.conditions || conditions.conditions.length === 0) && (
                <Card>
                  <CardContent>
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No specific hidden conditions found for this scheme.
                      Always verify with official sources.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
