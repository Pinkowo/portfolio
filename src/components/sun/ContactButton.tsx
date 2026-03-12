'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface ContactButtonProps {
  href: string
}

export function ContactButton({ href }: ContactButtonProps) {
  const t = useTranslations('final')

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, brightness: 1.1 } as any}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center justify-center font-sans text-white font-semibold rounded-lg"
      style={{ width: 232, height: 52, background: '#F97316' }}
      id="contact"
    >
      {t('contact')}
    </motion.a>
  )
}
