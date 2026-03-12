'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface HeroEarthProps {
  name: string
}

export function HeroEarth({ name }: HeroEarthProps) {
  const t = useTranslations('hero')

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative flex items-center justify-center"
      >
        {/* Atmosphere glow */}
        <div
          className="absolute rounded-full"
          style={{ width: 760, height: 760, background: 'radial-gradient(circle, #0A2040 0%, transparent 70%)' }}
        />
        {/* Earth body */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{ width: 680, height: 680, background: '#1B4FAD' }}
        >
          {/* Continents */}
          <div className="absolute" style={{ width: 280, height: 220, background: '#2E7D32', borderRadius: '50%', top: '18%', left: '12%', transform: 'rotate(-20deg)' }} />
          <div className="absolute" style={{ width: 180, height: 150, background: '#388E3C', borderRadius: '50%', top: '45%', right: '15%', transform: 'rotate(15deg)' }} />
          {/* Ocean highlight */}
          <div className="absolute" style={{ width: 220, height: 170, background: 'rgba(33,150,243,0.3)', borderRadius: '50%', top: '30%', left: '35%' }} />
          {/* Cloud */}
          <div className="absolute" style={{ width: 130, height: 55, background: 'rgba(255,255,255,0.7)', borderRadius: '50%', top: '12%', left: '30%' }} />
        </div>
      </motion.div>

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute text-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <p className="text-[#3B82F6] font-mono text-sm mb-2 tracking-widest uppercase">EARTH</p>
        <h1 className="text-white font-sans font-bold leading-none mb-3"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
          {t('greeting')} <span className="text-[#3B82F6]">{name}</span>
        </h1>
        <p className="text-[#6B7BA4] font-sans text-base">{t('subtitle')}</p>
      </motion.div>

      {/* Scroll hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-12 text-[#6B7BA4] text-sm font-mono animate-bounce"
      >
        {t('scroll')} ↓
      </motion.p>
    </section>
  )
}
