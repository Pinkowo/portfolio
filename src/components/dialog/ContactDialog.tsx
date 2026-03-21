'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { X, Mail, Phone, Linkedin, Github, FileText, Copy, Check } from 'lucide-react'
import { useContactDialog } from '@/context/ContactDialogContext'
import { PROFILE } from '@/lib/profile'

export function ContactDialog() {
  const { isOpen, close } = useContactDialog()
  const t = useTranslations('contactDialog')
  const locale = useLocale()
  const [copied, setCopied] = useState(false)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    },
    [close],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = PROFILE.email
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const rows: { icon: React.ReactNode; label: string; value?: string; href?: string; onClick?: () => void; extra?: React.ReactNode }[] = [
    {
      icon: <Mail size={18} />,
      label: t('email'),
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      extra: (
        <button
          onClick={(e) => {
            e.preventDefault()
            handleCopyEmail()
          }}
          className="ml-2 p-1.5 rounded text-[#6B7BA4] hover:text-white hover:bg-[#1B3A6E]/50 transition-colors"
          aria-label="Copy email"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      ),
    },
    PROFILE.phone
      ? { icon: <Phone size={18} />, label: t('phone'), value: PROFILE.phone, href: `tel:${PROFILE.phone}` }
      : null,
    PROFILE.linkedinUrl
      ? { icon: <Linkedin size={18} />, label: t('linkedin'), value: PROFILE.linkedinUrl, href: PROFILE.linkedinUrl }
      : null,
    PROFILE.githubUrl
      ? { icon: <Github size={18} />, label: t('github'), value: PROFILE.githubUrl, href: PROFILE.githubUrl }
      : null,
    PROFILE.resumeUrl
      ? { icon: <FileText size={18} />, label: t('resume'), value: PROFILE.resumeUrl, href: PROFILE.resumeUrl }
      : null,
  ].filter(Boolean) as NonNullable<(typeof rows)[number]>[]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog centering wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            key="contact-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto max-w-md w-full rounded-2xl border border-[#1B3A6E]/60 p-6 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #080C1A 0%, #03050F 100%)',
            }}
            role="dialog"
            aria-modal
            aria-label={t('title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-sans font-bold text-xl">{locale === 'en' ? PROFILE.nameEn : PROFILE.name}</h2>
                <p className="text-[#6B7BA4] text-sm mt-0.5">{PROFILE.nickname}</p>
              </div>
              <button
                onClick={close}
                className="p-1.5 rounded text-[#6B7BA4] hover:text-white hover:bg-[#1B3A6E]/50 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Copied feedback */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-3 text-center text-sm text-emerald-400 font-mono"
                >
                  {t('copied')}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact rows */}
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.href?.startsWith('mailto:') || row.href?.startsWith('tel:') ? undefined : '_blank'}
                  rel={row.href?.startsWith('mailto:') || row.href?.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#C8D2E8] hover:text-white hover:bg-[#1B3A6E]/30 transition-colors group"
                >
                  <span className="text-[#6B7BA4] group-hover:text-[#3B82F6] transition-colors">
                    {row.icon}
                  </span>
                  <span className="text-sm flex-1 truncate">{row.value}</span>
                  {row.extra}
                </a>
              ))}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
