export type PlanetKey =
  | 'earth'
  | 'saturn'
  | 'moon'
  | 'jupiter'
  | 'mars'
  | 'neptune'
  | 'uranus'
  | 'venus'
  | 'mercury'

export interface Project {
  id: string
  name: string
  desc: string
  tech: string[]
  screenshotUrl: string
  demoUrl?: string
  githubUrl?: string
  planet: PlanetKey
}

export interface PlanetConfig {
  key: PlanetKey
  /** Display name (decorative label, e.g. "SATURN") */
  label: string
  /** Main body color */
  color: string
  /** Monospace label accent color */
  labelColor: string
  /** Hover card background tint */
  hoverBg: string
  /** Diameter in px at desktop */
  size: number
  /** Scroll progress threshold (0–1) where this planet is fully visible */
  scrollThreshold: number
  /** Whether this planet has a ring */
  hasRing?: boolean
  /** Which side the planet circle appears on (card is on the opposite side) */
  side: 'left' | 'right'
}
