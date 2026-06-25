'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { ArrowRight, FileText, Search, Shield, MessageCircle, GitCompare, BarChart3, Volume2, BookOpen, HeartHandshake, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'Policy Explainer',
    desc: 'Understand any government scheme in simple Grade 6-8 level language with examples and analogies.',
    href: '/explainer',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  },
  {
    icon: Search,
    title: 'Hidden Conditions Detector',
    desc: 'Find exclusions, penalties, and obligations hidden in legal jargon. Green, Yellow, Red alerts.',
    href: '/explainer',
    color: 'text-red-600 bg-red-100 dark:bg-red-900/30'
  },
  {
    icon: MessageCircle,
    title: 'AI Chatbot',
    desc: 'Ask natural questions: "Do I qualify?" "What is the catch?" Get honest answers instantly.',
    href: '/chatbot',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  },
  {
    icon: GitCompare,
    title: 'Compare Policies',
    desc: 'Side-by-side comparison of benefits, eligibility, risks, and application process.',
    href: '/compare',
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
  },
  {
    icon: BarChart3,
    title: 'Impact Dashboard',
    desc: 'Real-time statistics: beneficiaries, funds disbursed, state-wise coverage from official data.',
    href: '/dashboard',
    color: 'text-safron-600 bg-safron-100 dark:bg-amber-900/30'
  },
  {
    icon: Volume2,
    title: 'Voice-First Access',
    desc: 'Speak in Hindi or regional languages. Listen to explanations. Large buttons for easy use.',
    href: '/explainer',
    color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30'
  },
]

const STATS = [
  { number: '20+', label: 'Schemes Covered', desc: 'Central & State schemes' },
  { number: '10', label: 'Languages', desc: 'English + 9 Indian languages' },
  { number: 'Grade 6-8', label: 'Reading Level', desc: 'Ultra-simple explanations' },
  { number: '100%', label: 'Transparent', desc: 'Sources & confidence levels' },
]

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-safron-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1YzdjZmEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              India&apos;s First Policy Literacy Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              Understand Every
              <span className="text-primary-600 dark:text-primary-400"> Government Scheme</span>
              {' '}in Simple Words
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              JanNiti explains central and state government schemes in plain language.
              No legal jargon. No confusion. Just clear answers you can trust.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explainer">
                <Button size="lg" className="text-lg px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Search a Scheme
                </Button>
              </Link>
              <Link href="/chatbot">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Ask AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.number}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            What Can You Do on JanNiti?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to make informed decisions about government schemes
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Link key={i} href={feature.href}>
                <Card interactive className="h-full">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                    Try now <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gradient-to-r from-primary-50 to-safron-50 dark:from-gray-800 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Built on Trust and Transparency
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Every explanation on JanNiti includes the official source, ministry name, last updated date,
              and a confidence indicator. Our AI is trained on official government data and we always
              remind you to verify with official sources before applying.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-600 font-semibold mb-1">
                  <HeartHandshake className="w-5 h-5" />
                  Trustworthy
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Official sources cited for every response</p>
              </div>
              <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary-600 font-semibold mb-1">
                  <BookOpen className="w-5 h-5" />
                  Simple Language
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Grade 6-8 reading level with examples</p>
              </div>
              <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-safron-600 font-semibold mb-1">
                  <Shield className="w-5 h-5" />
                  No Misinformation
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI guidance is clearly labeled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to understand government schemes?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              No registration required. Start exploring schemes that matter to you.
            </p>
            <Link href="/explainer">
              <Button variant="secondary" size="lg" className="text-lg bg-white text-primary-700 hover:bg-primary-50">
                <Search className="w-5 h-5 mr-2" />
                Search a Scheme Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="w-4 h-4 text-primary-600" />
              JanNiti - Policy Literacy for All
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Disclaimer: AI guidance does not replace official notifications</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
