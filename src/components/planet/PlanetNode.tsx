'use client'

import { motion, useTransform, useSpring, type MotionValue } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { TechTag } from '@/components/ui/TechTag'
import type { Project, PlanetConfig } from '@/types/project'

interface PlanetNodeProps {
  planet: PlanetConfig
  project?: Project
  side?: 'left' | 'right'
  onSelect: (project: Project) => void
  scrollProgress: MotionValue<number>
}

export const PLANET_ROW_HEIGHT = 480

export function PlanetNode({ planet, project, side = 'right', onSelect, scrollProgress }: PlanetNodeProps) {
  const t = useTranslations('planet')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const size = Math.min(planet.size, isMobile ? 110 : 280)

  const fromX = side === 'left' ? -300 : 300

  // ── Scroll-driven entry animation ────────────────────────────────────
  // Card and planet must be in position BEFORE the rocket arrives at T.
  // Card appears first (T-0.12 → T-0.06), then planet flies in (T-0.07 → T).
  const T = planet.scrollThreshold
  const rawEnter = useTransform(scrollProgress, [Math.max(0, T - 0.07), T], [0, 1])
  // Spring gives the fly-in a bouncy feel (matches original whileInView spring)
  const enterProgress = useSpring(rawEnter, { stiffness: 60, damping: 16, mass: 1.2 })
  const planetX = useTransform(enterProgress, [0, 1], [fromX, 0])
  const planetScale = useTransform(enterProgress, [0, 1], [0.1, 1])
  const planetOpacity = useTransform(enterProgress, [0, 1], [0, 1])

  // Card enters earlier than the planet so it's ready when the rocket arrives
  const rawCardEnter = useTransform(scrollProgress, [Math.max(0, T - 0.12), Math.max(0, T - 0.05)], [0, 1])
  const cardProgress = useSpring(rawCardEnter, { stiffness: 80, damping: 18 })
  const cardX = useTransform(cardProgress, [0, 1], [side === 'left' ? 40 : -40, 0])
  const cardOpacity = useTransform(cardProgress, [0, 1], [0, 1])

  // ── Planet circle ────────────────────────────────────────────────────
  const planetCircle = (
    <motion.div
      style={{ x: planetX, scale: planetScale, opacity: planetOpacity }}
    >
      <motion.div
        animate={{ scale: 1, filter: 'drop-shadow(0 0 0px transparent)' }}
        whileHover={{
          scale: 1.1,
          filter: `drop-shadow(0 0 22px ${planet.color}) drop-shadow(0 0 8px ${planet.color})`,
        }}
        transition={{ duration: 0.22 }}
        className="flex flex-col items-center"
        onClick={() => project && onSelect(project)}
        style={{ cursor: project ? 'pointer' : 'default' }}
      >
        <div className="relative">
          {/* Saturn ring — behind */}
          {planet.hasRing && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
              style={{ width: size * 1.6, height: size * 0.25, background: '#C8A850', zIndex: 0 }}
            />
          )}
          {/* Planet body */}
          <div
            className="relative rounded-full"
            style={{ width: size, height: size, background: planet.color, zIndex: 1 }}
          >
            {planet.key === 'jupiter' && (
              <>
                <div className="absolute rounded-full opacity-70" style={{ width: '95%', height: '17%', background: '#A0612C', top: '30%', left: '2.5%' }} />
                <div className="absolute rounded-full opacity-60" style={{ width: '92%', height: '22%', background: '#D4924A', top: '42%', left: '4%' }} />
                <div className="absolute rounded-full opacity-70" style={{ width: '90%', height: '14%', background: '#A0612C', top: '60%', left: '5%' }} />
              </>
            )}
            {planet.key === 'mars' && (
              <div className="absolute rounded-full" style={{ width: '27%', height: '12%', background: '#F0F4FF', top: '5%', left: '37%' }} />
            )}
            {planet.key === 'neptune' && (
              <div className="absolute rounded-full opacity-50" style={{ width: '91%', height: '15%', background: '#2E46B0', top: '45%', left: '4.5%' }} />
            )}
            {planet.key === 'moon' && (
              <>
                <div className="absolute rounded-full opacity-60" style={{ width: '22%', height: '22%', background: '#64748B', top: '20%', left: '20%' }} />
                <div className="absolute rounded-full opacity-60" style={{ width: '14%', height: '14%', background: '#64748B', top: '55%', left: '55%' }} />
              </>
            )}
            {planet.key === 'uranus' && (
              <>
                {/* Tilted atmospheric bands */}
                <div className="absolute opacity-30" style={{ width: '100%', height: '18%', background: '#5EEAD4', top: '28%', left: 0, borderRadius: '40%' }} />
                <div className="absolute opacity-20" style={{ width: '100%', height: '12%', background: '#A7F3D0', top: '46%', left: 0, borderRadius: '40%' }} />
                <div className="absolute opacity-25" style={{ width: '100%', height: '10%', background: '#5EEAD4', top: '62%', left: 0, borderRadius: '40%' }} />
                {/* Polar glow — Uranus is tilted so poles face us */}
                <div className="absolute rounded-full opacity-40" style={{ width: '45%', height: '45%', background: 'radial-gradient(circle, #A5F3FC 0%, transparent 70%)', top: '5%', left: '28%' }} />
              </>
            )}
            {planet.key === 'venus' && (
              <>
                {/* Dense cloud swirls */}
                <div className="absolute opacity-25" style={{ width: '90%', height: '20%', background: '#F5C842', top: '20%', left: '5%', borderRadius: '50%', transform: 'rotate(-8deg)' }} />
                <div className="absolute opacity-20" style={{ width: '85%', height: '18%', background: '#E8A020', top: '38%', left: '8%', borderRadius: '50%', transform: 'rotate(5deg)' }} />
                <div className="absolute opacity-25" style={{ width: '88%', height: '15%', background: '#F5C842', top: '55%', left: '6%', borderRadius: '50%', transform: 'rotate(-3deg)' }} />
                {/* Bright highlight — thick atmosphere scatters light */}
                <div className="absolute rounded-full opacity-35" style={{ width: '40%', height: '35%', background: 'radial-gradient(circle, #FEF3C7 0%, transparent 70%)', top: '8%', left: '12%' }} />
              </>
            )}
            {planet.key === 'mercury' && (
              <>
                {/* Large impact craters */}
                <div className="absolute rounded-full opacity-50" style={{ width: '28%', height: '28%', background: '#6B7280', top: '15%', left: '55%' }} />
                <div className="absolute rounded-full opacity-40" style={{ width: '18%', height: '18%', background: '#6B7280', top: '55%', left: '18%' }} />
                <div className="absolute rounded-full opacity-45" style={{ width: '22%', height: '22%', background: '#6B7280', top: '62%', left: '58%' }} />
                {/* Small craters */}
                <div className="absolute rounded-full opacity-35" style={{ width: '12%', height: '12%', background: '#9CA3AF', top: '35%', left: '25%' }} />
                <div className="absolute rounded-full opacity-30" style={{ width: '10%', height: '10%', background: '#9CA3AF', top: '22%', left: '40%' }} />
                {/* Terminator shadow — mercury is tidally half-dark */}
                <div className="absolute rounded-full opacity-30" style={{ width: '50%', height: '100%', background: 'linear-gradient(to right, transparent, #1F2937)', top: 0, right: 0, borderRadius: '0 50% 50% 0' }} />
              </>
            )}
          </div>
          {/* Saturn ring — in front */}
          {planet.hasRing && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: size * 1.6, height: size * 0.15, background: '#030308', zIndex: 2 }}
            />
          )}
        </div>
        {/* Planet label */}
        <p className="font-mono text-[11px] tracking-widest mt-3 pointer-events-none" style={{ color: planet.labelColor }}>
          {planet.label}
        </p>
      </motion.div>
    </motion.div>
  )

  // ── Project card ─────────────────────────────────────────────────────
  const btnAlign = side === 'left' ? 'justify-start' : 'justify-end'

  const projectCard = project ? (
    <motion.div
      style={{ x: cardX, opacity: cardOpacity }}
      className="w-full px-6 md:px-10"
    >
      <div
        className="rounded-2xl border p-6 md:p-8 flex flex-col gap-4"
        style={{
          background: planet.hoverBg + 'B3',
          borderColor: planet.labelColor + '33',
          boxShadow: `0 0 40px ${planet.color}18`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div>
          <p className="font-mono text-[10px] tracking-widest mb-1.5 uppercase" style={{ color: planet.labelColor }}>
            {planet.label}
          </p>
          <h3
            className="text-white font-sans font-bold leading-tight"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
          >
            {project.name}
          </h3>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <TechTag key={tech} label={tech} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: planet.labelColor + '22' }} />

        {/* Description */}
        <p className="text-[#7A8AB4] font-sans text-sm leading-relaxed">
          {project.highlight}
        </p>

        {/* Links — button always toward screen center */}
        <div className={`flex gap-3 flex-wrap ${btnAlign}`}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-sans text-white border border-[#1B3A6E] hover:border-[#3B82F6] transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-sans text-white transition-colors hover:brightness-110"
              style={{ background: '#1B4FAD' }}
            >
              Live Demo ↗
            </a>
          )}
          <button
            className="px-4 py-2 rounded-lg text-sm font-sans text-white transition-colors hover:brightness-110 cursor-pointer"
            style={{ background: `${planet.color}CC` }}
            onClick={() => onSelect(project)}
          >
            {t('viewProject')} →
          </button>
        </div>
      </div>
    </motion.div>
  ) : null

  // ── Mobile: vertical stack (planet → card) ────────────────────────────
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center gap-6 py-8">
        <div className="flex justify-center">{planetCircle}</div>
        {projectCard}
      </div>
    )
  }

  // ── Desktop: two equal 50vw columns ───────────────────────────────────
  return (
    <div className="w-full flex items-center" style={{ height: PLANET_ROW_HEIGHT }}>
      {/* Left column */}
      <div className={`w-1/2 h-full flex items-center ${
        side === 'left' ? 'justify-center' : 'justify-start'
      }`}>
        {side === 'left' ? planetCircle : projectCard}
      </div>
      {/* Right column */}
      <div className={`w-1/2 h-full flex items-center ${
        side === 'left' ? 'justify-start' : 'justify-center'
      }`}>
        {side === 'left' ? projectCard : planetCircle}
      </div>
    </div>
  )
}
