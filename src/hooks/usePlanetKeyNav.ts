'use client'

import { useEffect, useRef } from 'react'
import { animate, type MotionValue } from 'framer-motion'
import { PLANETS_CONFIG } from '@/lib/constants'

// Sorted thresholds: Earth (0) → planets → Sun (1.0)
const THRESHOLDS = [
  0,
  ...PLANETS_CONFIG
    .filter(p => p.key !== 'earth')
    .map(p => p.scrollThreshold)
    .sort((a, b) => a - b),
  1.0,
]

/** Max ms between keydown→keyup to count as a single tap */
const TAP_MS = 200

export function usePlanetKeyNav(
  scrollProgress: MotionValue<number>,
  containerRef: React.RefObject<HTMLDivElement>,
) {
  const keydownTimeRef = useRef(0)
  const animRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !e.repeat) {
        keydownTimeRef.current = Date.now()
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      const elapsed = Date.now() - keydownTimeRef.current
      keydownTimeRef.current = 0

      // Long press → default scroll already handled, do nothing
      if (elapsed > TAP_MS) return

      const container = containerRef.current
      if (!container) return

      const current = scrollProgress.get()
      const EPS = 0.01
      let target: number

      if (e.key === 'ArrowDown') {
        target = THRESHOLDS.find(t => t > current + EPS) ?? 1.0
      } else {
        target = [...THRESHOLDS].reverse().find(t => t < current - EPS) ?? 0
      }

      // Scale duration by distance: nearby = snappy, far = longer
      const distance = Math.abs(target - current)
      const duration = Math.max(0.5, Math.min(1.4, distance * 4))

      const scrollRange = container.offsetHeight - window.innerHeight
      const targetTop = target * scrollRange

      // Cancel any running animation
      animRef.current?.stop()

      animRef.current = animate(window.scrollY, targetTop, {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (v) => window.scrollTo(0, v),
      })
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      animRef.current?.stop()
    }
  }, [scrollProgress, containerRef])
}
