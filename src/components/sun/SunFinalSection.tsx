'use client'

import { motion, useAnimation } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { ContactButton } from './ContactButton'

interface SunFinalSectionProps {
  contactHref?: string
}

export function SunFinalSection({ contactHref = 'mailto:hello@example.com' }: SunFinalSectionProps) {
  const t = useTranslations('final')
  const tFooter = useTranslations('footer')
  const sunRef = useRef<HTMLDivElement>(null)
  const sunInView = useInView(sunRef, { once: true, margin: '-20%' })
  const sunControls = useAnimation()

  useEffect(() => {
    if (sunInView) {
      sunControls.start({
        scale: [0.85, 1.05, 1],
        opacity: [0, 1, 1],
        transition: { duration: 1.2, ease: 'easeOut' },
      })
    }
  }, [sunInView, sunControls])

  return (
    <section className="relative flex flex-col items-center justify-end" style={{ minHeight: '140vh', paddingBottom: 0 }}>
      {/* Text + button above sun */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center mb-16 px-4"
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

      {/* Sun */}
      <motion.div
        ref={sunRef}
        animate={sunControls}
        initial={{ opacity: 0, scale: 0.85 }}
        className="relative flex items-end justify-center w-full overflow-hidden"
        style={{ height: 600 }}
      >
        {/* Corona outer */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 1200, height: 1200, background: 'radial-gradient(circle, #7C2D04 0%, transparent 60%)', transform: 'translateX(-50%) translateY(60%)' }}
        />
        {/* Corona */}
        <div
          className="absolute bottom-0 left-1/2 rounded-full"
          style={{ width: 900, height: 900, background: 'radial-gradient(circle, #B45309 0%, transparent 65%)', transform: 'translateX(-50%) translateY(55%)' }}
        />
        {/* Glow */}
        <div
          className="absolute bottom-0 left-1/2 rounded-full"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)', transform: 'translateX(-50%) translateY(50%)' }}
        />
        {/* Sun body */}
        <div
          className="relative rounded-full z-10"
          style={{ width: 600, height: 600, background: '#FCD34D', boxShadow: '0 0 60px #FBBF24', transform: 'translateY(50%)' }}
        >
          {/* Sun highlight */}
          <div
            className="absolute rounded-full"
            style={{ width: '70%', height: '50%', background: 'rgba(254,243,199,0.3)', top: '10%', left: '15%' }}
          />
        </div>
      </motion.div>

      {/* Footer */}
      <p className="absolute bottom-4 text-[13px] font-sans" style={{ color: '#78350F' }}>
        {tFooter('credit')}
      </p>
    </section>
  )
}
