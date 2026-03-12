'use client'

import { useMemo } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  color: string
  opacity: number
}

const STAR_COLORS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#C7D2FE', '#A5B4FC']

export function StarField({ count = 200 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      opacity: Math.random() * 0.6 + 0.2,
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill={star.color}
            opacity={star.opacity}
          />
        ))}
      </svg>
    </div>
  )
}
