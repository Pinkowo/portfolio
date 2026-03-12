'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { TechTag } from '@/components/ui/TechTag'
import type { Project } from '@/types/project'
import type { PlanetConfig } from '@/types/project'

interface HoverCardProps {
  project: Project
  planet: PlanetConfig
}

export function HoverCard({ project, planet }: HoverCardProps) {
  const t = useTranslations('planet')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute z-20 rounded-lg border border-[#1B3A6E] p-4 pointer-events-none"
      style={{
        width: 295,
        background: planet.hoverBg,
        top: '50%',
        left: 'calc(100% + 20px)',
        transform: 'translateY(-50%)',
      }}
    >
      <p className="text-[#E0E7FF] font-sans text-[13px] font-semibold mb-1 truncate">
        {project.name}
      </p>
      <div className="flex flex-wrap gap-1 mb-2">
        {project.tech.slice(0, 4).map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
      </div>
      <div className="h-px bg-[#1B3A6E] my-2" />
      <p className="text-[#7A8AB4] font-sans text-[12px] leading-relaxed line-clamp-2 mb-3">
        {project.desc}
      </p>
      <div
        className="inline-block px-3 py-1 rounded text-xs font-sans text-white"
        style={{ background: '#1B4FAD' }}
      >
        {t('viewProject')} →
      </div>
    </motion.div>
  )
}
