'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useContactDialog } from '@/context/ContactDialogContext'

export function ContactButton() {
  const t = useTranslations('final')
  const { open } = useContactDialog()

  return (
    <motion.button
      onClick={open}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center justify-center font-sans text-white font-semibold rounded-lg"
      style={{ width: 232, height: 52, background: '#F97316' }}
      id="contact"
    >
      {t('contact')}
    </motion.button>
  )
}
