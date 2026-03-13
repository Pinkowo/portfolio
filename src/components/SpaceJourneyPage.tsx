'use client'

import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { NavBar } from '@/components/nav/NavBar'
import { StarField } from '@/components/space/StarField'
import { HeroEarth } from '@/components/space/HeroEarth'
import { PlanetNode } from '@/components/planet/PlanetNode'
import { ProjectDialog } from '@/components/dialog/ProjectDialog'
import { Rocket } from '@/components/rocket/Rocket'
import { SunFinalSection } from '@/components/sun/SunFinalSection'
import { PLANETS_CONFIG, SCENE_HEIGHT, SCROLL_DRIVE_HEIGHT } from '@/lib/constants'
import { useScrollRocket } from '@/hooks/useScrollRocket'
import type { Project } from '@/types/project'

interface SpaceJourneyPageProps {
  projects: Project[]
  name: string
  contactHref?: string
}

// Earth radius = 340px. Position wrapper so Earth TOP EDGE is at 50vh,
// making rocket (fixed at 50vh) appear to hover at Earth's atmosphere.
const EARTH_RADIUS = 340
const EARTH_TOP_OFFSET = `calc(50vh - ${EARTH_RADIUS}px)`

export function SpaceJourneyPage({ projects, name, contactHref }: SpaceJourneyPageProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { containerRef, planetsY, rocketScale, flameOpacity, isLanding, scrollProgress } = useScrollRocket()

  // ── Sun orbital arc ──────────────────────────────────────────────────
  // Half-circle orbit: rocket swings down-left past the Sun body,
  // arcs around and stops at the Sun's LEFT equator (x=−300, y=0).
  // Landing at the equator keeps the rocket at 50vh — fully visible,
  // no text overlap (text is at top 8%=64px, rocket at 400px=50vh).
  const SUN_R = 300
  // Half-circle orbit: rocket descends directly below Sun, swings left,
  // arcs up through upper-left quadrant, stops at Sun top center (x=0, y=-262).
  // Sun center at 65vh; rocket base lands at Sun top edge (220px from viewport top).
  const orbitX = useTransform(
    scrollProgress,
    [0.87, 0.91, 0.95, 0.98, 0.995, 1.0],
    [0, 0, -420, -350, -200, 0],
  )
  const orbitY = useTransform(
    scrollProgress,
    [0.87, 0.91, 0.95, 0.98, 0.995, 1.0],
    [0, 150, 100, -200, -210, -180],
  )
  const orbitRotate = useTransform(
    scrollProgress,
    [0.87, 0.91, 0.95, 0.98, 1.0],
    [0, 5, -28, -15, 0],
  )

  const projectByPlanet = Object.fromEntries(projects.map((p) => [p.planet, p]))
  const displayPlanets = PLANETS_CONFIG.filter((p) => p.key !== 'earth')

  return (
    // Invisible scroll-drive container — its height drives scrollYProgress
    <div ref={containerRef} className="relative bg-[#030308]" style={{ minHeight: SCROLL_DRIVE_HEIGHT }}>

      {/* ── Static fixed layers ───────────────────────────────────────── */}
      <StarField count={250} />
      <NavBar name={name} />

      {/* ── Rocket — truly fixed at viewport center ───────────────────────
          Scale animates at journey endpoints:
            scroll 0→8%   : 1.8→1.0  (leaving Earth)
            scroll 8→85%  : 1.0      (deep space)
            scroll 85→100%: 1.0→2.2  (approaching Sun)
          z-index switches at scroll > 0.92 for sun-landing layering.     */}
      {/* Outer div: pure CSS centering — no conflict with Framer Motion transforms */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: isLanding ? 20 : 30,
        }}
      >
        {/* Inner motion.div: orbital arc offset + bank rotation */}
        <motion.div style={{ x: orbitX, y: orbitY, rotate: orbitRotate }}>
          <Rocket scale={rocketScale} flameOpacity={flameOpacity} />
        </motion.div>
      </div>

      {/* ── Planets layer — moves DOWN on scroll, rocket appears to fly UP ─
          All celestial bodies (Earth, planets, Sun) live here.
          Each planet top = calc(50vh - T*SCENE_HEIGHT - planet.size/2)
          so its center aligns with the rocket (50vh) at scroll = T.       */}
      <motion.div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{ y: planetsY, zIndex: 10, height: 0, overflow: 'visible' }}
      >
        {/* ── Earth ──────────────────────────────────────────────────────
            Positioned so Earth's top edge is at 50vh (atmosphere level).
            Rocket at 50vh appears to launch from Earth's surface.         */}
        <div className="absolute w-full" style={{ top: EARTH_TOP_OFFSET }}>
          <HeroEarth name={name} />
        </div>

        {/* ── Planets ────────────────────────────────────────────────────
            top = calc(50vh - T*SCENE_HEIGHT - size/2) ensures planet
            center hits 50vh exactly when planetsY = T * SCENE_HEIGHT.     */}
        {displayPlanets.map((planet) => {
          const side = planet.side
          const topCss = `calc(50vh - ${planet.scrollThreshold * SCENE_HEIGHT + planet.size / 2}px)`
          return (
            <div
              key={planet.key}
              className="absolute w-full pointer-events-auto"
              style={{ top: topCss }}
            >
              <PlanetNode
                planet={planet}
                project={projectByPlanet[planet.key]}
                side={side}
                onSelect={setSelectedProject}

              />
            </div>
          )
        })}

        {/* ── Sun ────────────────────────────────────────────────────────
            Wrapper at top: -SCENE_HEIGHT.
            At scroll=100% (planetsY=SCENE_HEIGHT): wrapper lands at 0.
            SunFinalSection has min-h-screen; sun circle centered at 50%.
            → Sun center = 50vh = rocket level at scroll 100%.            */}
        <div
          className="absolute w-full pointer-events-auto"
          style={{ top: `-${SCENE_HEIGHT}px` }}
        >
          <SunFinalSection contactHref={contactHref} isLanding={isLanding} />
        </div>
      </motion.div>

      {/* ── Project dialog ───────────────────────────────────────────── */}
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
