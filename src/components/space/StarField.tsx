'use client'

import { useState, useEffect } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  color: string
  opacity: number
  twinkleDur: number   // seconds
  twinkleDelay: number // seconds
  pulse: boolean       // larger stars get size pulse too
}

const STAR_COLORS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#C7D2FE', '#A5B4FC', '#E0E7FF']

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 2.2 + 0.4
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      opacity: Math.random() * 0.55 + 0.25,
      twinkleDur: 2 + Math.random() * 4,
      twinkleDelay: Math.random() * 5,
      pulse: size > 1.8,
    }
  })
}

export function StarField({ count = 250 }: { count?: number }) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(generateStars(count))
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
          >
            {/* Opacity twinkle */}
            <animate
              attributeName="opacity"
              values={`${star.opacity};${(star.opacity * 0.25).toFixed(2)};${star.opacity}`}
              dur={`${star.twinkleDur}s`}
              begin={`${star.twinkleDelay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
            {/* Size pulse — bright stars only */}
            {star.pulse && (
              <animate
                attributeName="r"
                values={`${star.size};${(star.size * 1.6).toFixed(2)};${star.size}`}
                dur={`${star.twinkleDur * 1.3}s`}
                begin={`${star.twinkleDelay}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
            )}
          </circle>
        ))}
      </svg>
    </div>
  )
}
