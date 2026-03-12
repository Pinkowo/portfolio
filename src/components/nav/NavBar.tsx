'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { LanguageToggle } from './LanguageToggle'

export function NavBar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('nav')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-8 transition-all duration-300 ${
        scrolled
          ? 'bg-[#03030B]/90 backdrop-blur-md border-b border-[#0D1B3E]'
          : 'bg-transparent'
      }`}
    >
      <span className="text-white font-sans font-semibold text-base tracking-wide">
        {name}
      </span>
      <div className="flex items-center gap-6">
        <a href="#projects" className="hidden sm:block text-sm text-[#6B7BA4] hover:text-white transition-colors">
          {t('projects')}
        </a>
        <a href="#contact" className="hidden sm:block text-sm text-[#6B7BA4] hover:text-white transition-colors">
          {t('contact')}
        </a>
        <LanguageToggle />
      </div>
    </nav>
  )
}
