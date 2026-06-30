'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { useI18n } from '@/lib/i18n'
import { ArrowRight, FileText, Search, Shield, MessageCircle, GitCompare, BarChart3, Volume2, BookOpen, HeartHandshake, Sparkles } from 'lucide-react'

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const { t } = useI18n()

  const FEATURES = [
    { icon: FileText, title: t('feat_explainer_title'), desc: t('feat_explainer_desc'), href: '/explainer', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { icon: Search, title: t('feat_hidden_title'), desc: t('feat_hidden_desc'), href: '/explainer', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
    { icon: MessageCircle, title: t('feat_chatbot_title'), desc: t('feat_chatbot_desc'), href: '/chatbot', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    { icon: GitCompare, title: t('feat_compare_title'), desc: t('feat_compare_desc'), href: '/compare', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { icon: BarChart3, title: t('feat_dashboard_title'), desc: t('feat_dashboard_desc'), href: '/dashboard', color: 'text-safron-600 bg-safron-100 dark:bg-amber-900/30' },
    { icon: Volume2, title: t('feat_voice_title'), desc: t('feat_voice_desc'), href: '/explainer', color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30' },
  ]

  const STATS = [
    { number: t('stat_schemes_num'), label: t('stat_schemes_label'), desc: t('stat_schemes_desc') },
    { number: t('stat_langs_num'), label: t('stat_langs_label'), desc: t('stat_langs_desc') },
    { number: t('stat_reading_num'), label: t('stat_reading_label'), desc: t('stat_reading_desc') },
    { number: t('stat_transparent_num'), label: t('stat_transparent_label'), desc: t('stat_transparent_desc') },
  ]

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-safron-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('badge_platform')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              {t('hero_1')}
              <span className="text-primary-600 dark:text-primary-400"> {t('hero_gov')}</span>
              {' '}{t('hero_2')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('hero_sub')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explainer">
                <Button size="lg" className="text-lg px-8">
                  <Search className="w-5 h-5 mr-2" />
                  {t('btn_search_scheme')}
                </Button>
              </Link>
              <Link href="/chatbot">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('btn_ask_ai')}
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">{t('features_heading')}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('features_sub')}</p>
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
                    {t('try_now')} <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-gradient-to-r from-primary-50 to-safron-50 dark:from-gray-800 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('trust_heading')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('trust_sub')}</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-600 font-semibold mb-1">
                  <HeartHandshake className="w-5 h-5" />{t('trust_trustworthy_title')}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('trust_trustworthy_desc')}</p>
              </div>
              <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary-600 font-semibold mb-1">
                  <BookOpen className="w-5 h-5" />{t('trust_simple_title')}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('trust_simple_desc')}</p>
              </div>
              <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-safron-600 font-semibold mb-1">
                  <Shield className="w-5 h-5" />{t('trust_nomis_title')}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('trust_nomis_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('cta_heading')}</h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">{t('cta_sub')}</p>
            <Link href="/explainer">
              <Button variant="secondary" size="lg" className="text-lg bg-white text-primary-700 hover:bg-primary-50">
                <Search className="w-5 h-5 mr-2" />
                {t('btn_search_now')}
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
              {t('footer_tagline')}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{t('footer_disclaimer')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
