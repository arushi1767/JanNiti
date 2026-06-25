import { cn } from '@/lib/utils'
import { Shield, ExternalLink } from 'lucide-react'

interface SourceBadgeProps {
  source: string
  ministry: string
  lastUpdated: string
  confidence: string
}

export function SourceBadge({ source, ministry, lastUpdated, confidence }: SourceBadgeProps) {
  const confidenceColor = {
    High: 'text-green-600 dark:text-green-400',
    Medium: 'text-yellow-600 dark:text-yellow-400',
    Low: 'text-red-600 dark:text-red-400',
  }[confidence] || 'text-gray-500'

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 dark:text-gray-100">{source}</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Ministry: {ministry}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 dark:text-gray-400">Updated: {lastUpdated}</span>
            <span className={cn('font-medium', confidenceColor)}>
              Confidence: {confidence}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
