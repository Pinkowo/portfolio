import type { PlanetConfig, PlanetKey } from '@/types/project'

export const PLANETS_CONFIG: PlanetConfig[] = [
  {
    key: 'saturn',
    label: 'SATURN',
    color: '#E8C97C',
    labelColor: '#FDE68A',
    hoverBg: '#080600',
    size: 340,
    scrollThreshold: 0.12,
    hasRing: true,
  },
  {
    key: 'moon',
    label: 'MOON',
    color: '#94A3B8',
    labelColor: '#CBD5E1',
    hoverBg: '#050606',
    size: 200,
    scrollThreshold: 0.24,
  },
  {
    key: 'jupiter',
    label: 'JUPITER',
    color: '#C17F3E',
    labelColor: '#F97316',
    hoverBg: '#060300',
    size: 400,
    scrollThreshold: 0.38,
  },
  {
    key: 'mars',
    label: 'MARS',
    color: '#C1440E',
    labelColor: '#F97316',
    hoverBg: '#060100',
    size: 300,
    scrollThreshold: 0.52,
  },
  {
    key: 'neptune',
    label: 'NEPTUNE',
    color: '#3B5BDB',
    labelColor: '#93C5FD',
    hoverBg: '#010318',
    size: 460,
    scrollThreshold: 0.66,
  },
  {
    key: 'uranus',
    label: 'URANUS',
    color: '#7C3AED',
    labelColor: '#A78BFA',
    hoverBg: '#040106',
    size: 200,
    scrollThreshold: 0.78,
  },
  {
    key: 'earth',
    label: 'EARTH',
    color: '#1B4FAD',
    labelColor: '#3B82F6',
    hoverBg: '#040B18',
    size: 680,
    scrollThreshold: 0,
  },
]

export const PLANET_MAP = Object.fromEntries(
  PLANETS_CONFIG.map((p) => [p.key, p])
) as Record<PlanetKey, PlanetConfig>

/** Rocket size variants: [bodyW, bodyH] in px */
export const ROCKET_SIZES = [
  { w: 44, h: 88 },   // S (0–20%)
  { w: 70, h: 140 },  // M (20–40%)
  { w: 80, h: 158 },  // L (40–60%)
  { w: 96, h: 190 },  // XL (60–80%)
  { w: 120, h: 240 }, // Final (80–100%)
] as const

export const ROCKET_THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.8] as const

export const LOCALES = ['zh-TW', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'zh-TW'
