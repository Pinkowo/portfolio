'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { NavBar } from '@/components/nav/NavBar'
import { StarField } from '@/components/space/StarField'
import { TrajectoryPath } from '@/components/space/TrajectoryPath'
import { HeroEarth } from '@/components/space/HeroEarth'
import { PlanetNode } from '@/components/planet/PlanetNode'
import { ProjectDialog } from '@/components/dialog/ProjectDialog'
import { Rocket } from '@/components/rocket/Rocket'
import { SunFinalSection } from '@/components/sun/SunFinalSection'
import { PLANETS_CONFIG, ROCKET_THRESHOLDS } from '@/lib/constants'
import type { Project } from '@/types/project'
import type { RocketSizeIndex } from '@/components/rocket/Rocket'

interface SpaceJourneyPageProps {
  projects: Project[]
  name: string
  contactHref?: string
}

const TRAJECTORY_HEIGHT = 7200

export function SpaceJourneyPage({ projects, name, contactHref }: SpaceJourneyPageProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sizeIndex, setSizeIndex] = useState<RocketSizeIndex>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const rocketYPercent = useTransform(scrollYProgress, [0, 1], [0, 90])

  // Update rocket size on scroll
  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      let idx: RocketSizeIndex = 0
      for (let i = ROCKET_THRESHOLDS.length - 1; i >= 0; i--) {
        if (progress >= ROCKET_THRESHOLDS[i]) {
          idx = i as RocketSizeIndex
          break
        }
      }
      setSizeIndex(idx)
    })
  }, [scrollYProgress])

  // Map projects to planets
  const projectByPlanet = Object.fromEntries(
    projects.map((p) => [p.planet, p])
  )

  // Planets to display (exclude earth which is hero)
  const displayPlanets = PLANETS_CONFIG.filter((p) => p.key !== 'earth')

  return (
    <div ref={containerRef} className="relative bg-[#030308]">
      {/* Fixed layers */}
      <StarField count={250} />

      <NavBar name={name} />

      {/* Scrollable content */}
      <div className="relative" style={{ minHeight: TRAJECTORY_HEIGHT + 600 }}>
        <TrajectoryPath height={TRAJECTORY_HEIGHT} />

        {/* Rocket — fixed position, moves based on scroll */}
        <motion.div
          className="fixed left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{ top: rocketYPercent.get() + '%' }}
        >
          <motion.div
            key={sizeIndex}
            initial={{ opacity: 0.7, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Rocket sizeIndex={sizeIndex} />
          </motion.div>
        </motion.div>

        {/* Hero section */}
        <HeroEarth name={name} />

        {/* Planet sections */}
        <div id="projects" className="relative">
          {displayPlanets.map((planet, i) => {
            const project = projectByPlanet[planet.key]
            const side = i % 2 === 0 ? 'right' : 'left'
            const topOffset = 800 + i * 900

            return (
              <div
                key={planet.key}
                className="absolute w-full"
                style={{ top: topOffset }}
              >
                <PlanetNode
                  planet={planet}
                  project={project}
                  side={side}
                  onSelect={setSelectedProject}
                />
              </div>
            )
          })}
        </div>

        {/* Sun final section */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <SunFinalSection contactHref={contactHref} />
        </div>
      </div>

      {/* Project dialog */}
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
