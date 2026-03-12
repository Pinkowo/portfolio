'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { LOCALES, type Locale } from '@/lib/constants'

export function LanguageToggle() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const otherLocale = LOCALES.find((l) => l !== locale) ?? 'en'

  function handleToggle() {
    // Replace locale prefix in pathname
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-1 rounded border border-[#1B3A6E] text-sm font-mono text-[#6B7BA4] hover:text-white hover:border-[#3B82F6] transition-colors duration-150"
      aria-label={`Switch to ${otherLocale}`}
    >
      {locale === 'zh-TW' ? 'EN' : '中'}
    </button>
  )
}
