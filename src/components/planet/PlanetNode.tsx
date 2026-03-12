'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HoverCard } from './HoverCard'
import type { Project, PlanetConfig } from '@/types/project'

interface PlanetNodeProps {
  planet: PlanetConfig
  project?: Project
  side?: 'left' | 'right'
  onSelect: (project: Project) => void
}

export function PlanetNode({ planet, project, side = 'right', onSelect }: PlanetNodeProps) {
  const [hovered, setHovered] = useState(false)
  const size = Math.min(planet.size, 320) // Cap at 320px on screen

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative flex flex-col items-center ${side === 'left' ? 'mr-auto ml-8 md:ml-24' : 'ml-auto mr-8 md:mr-24'}`}
    >
      {/* Planet body */}
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.1 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => project && onSelect(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && project && onSelect(project)}
        aria-label={`View project: ${project?.name ?? planet.label}`}
      >
        {/* Saturn ring — back */}
        {planet.hasRing && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
            style={{ width: size * 1.6, height: size * 0.25, background: '#C8A850', zIndex: 0 }}
          />
        )}

        {/* Planet circle */}
        <div
          className="relative rounded-full"
          style={{ width: size, height: size, background: planet.color, zIndex: 1 }}
        >
          {/* Jupiter bands */}
          {planet.key === 'jupiter' && (
            <>
              <div className="absolute rounded-full opacity-70" style={{ width: '95%', height: '17%', background: '#A0612C', top: '30%', left: '2.5%' }} />
              <div className="absolute rounded-full opacity-60" style={{ width: '92%', height: '22%', background: '#D4924A', top: '42%', left: '4%' }} />
              <div className="absolute rounded-full opacity-70" style={{ width: '90%', height: '14%', background: '#A0612C', top: '60%', left: '5%' }} />
            </>
          )}
          {/* Mars polar cap */}
          {planet.key === 'mars' && (
            <div className="absolute rounded-full" style={{ width: '27%', height: '12%', background: '#F0F4FF', top: '5%', left: '37%' }} />
          )}
          {/* Neptune band */}
          {planet.key === 'neptune' && (
            <div className="absolute rounded-full opacity-50" style={{ width: '91%', height: '15%', background: '#2E46B0', top: '45%', left: '4.5%' }} />
          )}
          {/* Moon craters */}
          {planet.key === 'moon' && (
            <>
              <div className="absolute rounded-full opacity-60" style={{ width: '22%', height: '22%', background: '#64748B', top: '20%', left: '20%' }} />
              <div className="absolute rounded-full opacity-60" style={{ width: '14%', height: '14%', background: '#64748B', top: '55%', left: '55%' }} />
            </>
          )}
        </div>

        {/* Saturn ring — front */}
        {planet.hasRing && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: size * 1.6, height: size * 0.15, background: '#030308', zIndex: 2 }}
          />
        )}

        {/* HoverCard */}
        <AnimatePresence>
          {hovered && project && (
            <HoverCard project={project} planet={planet} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label + project name */}
      <div className="mt-3 text-center pointer-events-none">
        <p className="font-mono text-[11px] tracking-widest" style={{ color: planet.labelColor }}>
          {planet.label}
        </p>
        {project && (
          <p className="font-sans text-[15px] text-white font-semibold mt-1">{project.name}</p>
        )}
      </div>
    </motion.div>
  )
}
