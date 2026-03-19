'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ContactButton } from './ContactButton'

interface SunTextOverlayProps {
  contactHref?: string
}

export function SunTextOverlay({ contactHref = 'mailto:hello@example.com' }: SunTextOverlayProps) {
  const t = useTranslations('final')

  return (
    <section className="relative pointer-events-none" style={{ minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="absolute pointer-events-auto inset-x-0 mx-auto text-center md:inset-x-auto md:mx-0 md:right-[8%]"
        style={{ top: '8%', width: '90%', maxWidth: 600 }}
      >
        <h2
          className="font-sans font-bold text-white mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          {t('title')}
        </h2>
        <p className="font-sans text-[#FDE68A] text-lg mb-8">{t('subtitle')}</p>
        <ContactButton href={contactHref} />
      </motion.div>
    </section>
  )
}
