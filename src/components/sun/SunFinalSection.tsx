'use client'

import { motion, useAnimation } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { ContactButton } from './ContactButton'

interface SunFinalSectionProps {
  contactHref?: string
  isLanding?: boolean
}

/**
 * Sun section: corona + body centered at exactly 50% of a min-h-screen section.
 * SpaceJourneyPage positions this wrapper at top: -SCENE_HEIGHT so that at
 * scroll=100% (planetsY = SCENE_HEIGHT), the section fills the viewport and
 * the sun center lands at 50vh = rocket level.
 */
export function SunFinalSection({ contactHref = 'mailto:hello@example.com' }: SunFinalSectionProps) {
  const t = useTranslations('final')
  const tFooter = useTranslations('footer')
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-15%' })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start({ scale: [0.9, 1.05, 1], opacity: [0, 1, 1], transition: { duration: 1.2, ease: 'easeOut' } })
    }
  }, [inView, controls])

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: '100vh' }}>

      {/* ── Sun visual: corona + body centered at section 50% ──────────── */}
      {/* Static positioning wrapper (keeps translateX(-50%) separate from Framer Motion scale) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 'calc(65% - 300px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          overflow: 'visible',
        }}
      >
      <motion.div
        animate={controls}
        initial={{ opacity: 0, scale: 0.9 }}
        style={{ width: 600, height: 600, overflow: 'visible' }}
      >
        {/* Corona outer — 1200px centered on sun center */}
        <div
          className="absolute rounded-full"
          style={{
            width: 1200, height: 1200,
            top: -300, left: -300,
            background: 'radial-gradient(circle, #7C2D04 0%, transparent 60%)',
          }}
        />
        {/* Corona mid */}
        <div
          className="absolute rounded-full"
          style={{
            width: 900, height: 900,
            top: -150, left: -150,
            background: 'radial-gradient(circle, #B45309 0%, transparent 65%)',
          }}
        />
        {/* Glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: -50, left: -50,
            background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)',
          }}
        />
        {/* Sun body */}
        <div
          className="relative rounded-full"
          style={{ width: 600, height: 600, background: '#FCD34D', boxShadow: '0 0 80px #FBBF24' }}
        >
          <div
            className="absolute rounded-full"
            style={{ width: '70%', height: '50%', background: 'rgba(254,243,199,0.3)', top: '10%', left: '15%' }}
          />
        </div>
      </motion.div>
      </div>

      {/* ── Text + contact button — above the sun ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 text-center pointer-events-auto"
        style={{ top: '8%', transform: 'translateX(-50%)', width: '90%', maxWidth: 600 }}
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

      {/* Footer */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[13px] font-sans" style={{ color: '#78350F' }}>
        {tFooter('credit')}
      </p>
    </section>
  )
}
