'use client'
import { I18nProvider } from '@/lib/i18n'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { ToastProvider } from '@/lib/contexts/ToastContext'
<<<<<<< HEAD
=======
import AccessibilityPanel from '@/components/ui/AccessibilityPanel'
>>>>>>> 7a88719 (Improve multilingual pipeline, translation, and UI)
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <I18nProvider>
        <AuthProvider>
          {children}
<<<<<<< HEAD
=======
          <AccessibilityPanel />
>>>>>>> 7a88719 (Improve multilingual pipeline, translation, and UI)
        </AuthProvider>
      </I18nProvider>
    </ToastProvider>
  )
}
