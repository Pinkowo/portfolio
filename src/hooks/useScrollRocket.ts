'use client'

import { useScroll, useTransform, useSpring, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { useRef, useState } from 'react'
import { SCENE_HEIGHT, LANDING_THRESHOLD, PLANETS_CONFIG } from '@/lib/constants'

// Cosine-window smooth mapper: near each planet, speed drops to slowFactor×normal.
// Uses a raised-cosine bell so there are NO sharp kinks — purely smooth acceleration curve.
// Math guarantees:
//   y(T_i) = T_i × SCENE_HEIGHT  (planet always aligns with rocket at its threshold)
//   ∫ offset dp = 0               (y(1) = SCENE_HEIGHT exactly, no drift)
function buildSmoothPlanetMapper(slowHalf: number, slowFactor: number) {
  const thresholds = PLANETS_CONFIG
    .filter(p => p.key !== 'earth')
    .map(p => p.scrollThreshold)

  return (progress: number): number => {
    let offset = 0
    for (const T of thresholds) {
      const dist = progress - T
      if (Math.abs(dist) < slowHalf) {
        // Raised-cosine bell: 1 at centre, 0 at ±slowHalf — no kinks at boundary
        const weight = (1 + Math.cos(Math.PI * dist / slowHalf)) / 2
        // Pull progress toward T by (1−slowFactor) fraction → reduces local speed
        offset += dist * weight * (1 - slowFactor)
      }
    }
    return (progress - offset) * SCENE_HEIGHT
  }
}

const planetMapper = buildSmoothPlanetMapper(0.07, 0.25)

interface UseScrollRocketReturn {
  containerRef: React.RefObject<HTMLDivElement>
  planetsY: MotionValue<number>
  rocketScale: MotionValue<number>
  flameOpacity: MotionValue<number>
  isLanding: boolean
  scrollProgress: MotionValue<number>
}

export function useScrollRocket(): UseScrollRocketReturn {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [isLanding, setIsLanding] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth cosine slow-down near each planet, then spring for floaty feel
  const rawPlanetsY = useTransform(scrollYProgress, planetMapper)
  const planetsY = useSpring(rawPlanetsY, { stiffness: 120, damping: 28, restDelta: 0.5 })

  // Scale curve: big near Earth (1.8→1.0), constant mid-flight, modest grow near Sun (1.2)
  const rocketScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.85, 1.0],
    [1.8, 1.0, 1.0, 1.2]
  )

  // Flame off only when fully on Earth/Sun, ignites the moment lift-off begins
  const flameOpacity = useTransform(
    scrollYProgress,
    [0, 0.01, 0.96, 1.0],
    [0,  1,    1,   0]
  )


  // Switch z-index when rocket crosses into sun landing zone
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setIsLanding(progress > LANDING_THRESHOLD)
  })

  return {
    containerRef,
    planetsY,
    rocketScale,
    flameOpacity,
    isLanding,
    scrollProgress: scrollYProgress,
  }
}
