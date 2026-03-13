'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { TechTag } from '@/components/ui/TechTag'
import type { Project, PlanetConfig } from '@/types/project'

interface PlanetNodeProps {
  planet: PlanetConfig
  project?: Project
  side?: 'left' | 'right'
  onSelect: (project: Project) => void
}

export const PLANET_ROW_HEIGHT = 480

export function PlanetNode({ planet, project, side = 'right', onSelect }: PlanetNodeProps) {
  const t = useTranslations('planet')
  const size = Math.min(planet.size, 280)

  const fromX = side === 'left' ? -300 : 300

  // ── Planet circle ────────────────────────────────────────────────────
  // whileInView once:false → flies in when entering viewport, flies out when leaving
  const planetCircle = (
    <motion.div
      initial={{ x: fromX, scale: 0.1, opacity: 0 }}
      whileInView={{ x: 0, scale: 1, opacity: 1 }}
      viewport={{ once: false, margin: '500px 0px 500px 0px' }}
      transition={{ type: 'spring', stiffness: 60, damping: 16, mass: 1.2 }}
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
      initial={{ opacity: 0, x: side === 'left' ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
      className="w-full px-6 md:px-10"
    >
      <div
        className="rounded-2xl border p-6 md:p-8 flex flex-col gap-4"
        style={{
          background: planet.hoverBg,
          borderColor: planet.labelColor + '33',
          boxShadow: `0 0 40px ${planet.color}18`,
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
          {project.desc}
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

  // ── Row: two equal 50vw columns ───────────────────────────────────────
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
