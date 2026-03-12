'use client'

import { useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ROCKET_THRESHOLDS } from '@/lib/constants'
import type { RocketSizeIndex } from '@/components/rocket/Rocket'

interface UseScrollRocketReturn {
  containerRef: React.RefObject<HTMLDivElement>
  rocketY: MotionValue<number>
  sizeIndex: RocketSizeIndex
  scrollProgress: MotionValue<number>
}

export function useScrollRocket(): UseScrollRocketReturn {
  const containerRef = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Convert scroll progress to a Y percentage (0% at Earth, 100% at Sun)
  // We'll return this as a CSS transform value in the component
  const rawY = useTransform(scrollYProgress, [0, 1], ['0%', '92%'])
  const rocketY = useSpring(rawY as any, { stiffness: 80, damping: 20 }) as any

  // Compute size index based on current scroll progress
  const sizeIndexValue = useMotionValue(0)

  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      let idx = 0
      for (let i = ROCKET_THRESHOLDS.length - 1; i >= 0; i--) {
        if (progress >= ROCKET_THRESHOLDS[i]) {
          idx = i
          break
        }
      }
      sizeIndexValue.set(idx)
    })
  }, [scrollYProgress, sizeIndexValue])

  return {
    containerRef,
    rocketY,
    sizeIndex: sizeIndexValue.get() as RocketSizeIndex,
    scrollProgress,
  }
}
