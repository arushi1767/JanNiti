import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', label: 'Language' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', label: 'भाषा' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', label: 'ভাষা' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', label: 'ভাষা' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर्र', label: 'बिसहाय' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', label: 'भासा' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', label: 'ભાષા' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', label: 'ಭಾಷೆ' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', label: 'जायज़' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', label: 'भाषा' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', label: 'भाषा' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', label: 'ഭാഷ' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মেইতেইলোন্', label: 'ꯂꯥꯏ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', label: 'भाषा' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', label: 'भाषा' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', label: 'ଭାଷା' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', label: 'ਭਾਸ਼ਾ' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', label: 'भाषा' },
  { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', label: 'ᱵᱟᱥᱟ' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', label: 'ٻولي' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', label: 'மொழி' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', label: 'భాష' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', label: 'زبان' },
]

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options?.method,
    headers: mergedHeaders,
    body: options?.body,
    signal: options?.signal,
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const errMsg = body?.error || body?.detail || `Request failed with status ${res.status}`
    console.error(`API Error [${res.status}] ${endpoint}:`, errMsg)
    throw new Error(errMsg)
  }

  // Unwrap standardized { success, data, error } format
  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) {
      throw new Error(body.error || 'Request failed')
    }
    return body.data
  }

  // Fallback: return body as-is for non-wrapped responses
  return body
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence?.toLowerCase()) {
    case 'high': return 'text-green-600 dark:text-green-400'
    case 'medium': return 'text-yellow-600 dark:text-yellow-400'
    case 'low': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-500'
  }
}
