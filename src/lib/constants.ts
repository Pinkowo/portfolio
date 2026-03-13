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
    side: 'left',
  },
  {
    key: 'moon',
    label: 'MOON',
    color: '#94A3B8',
    labelColor: '#CBD5E1',
    hoverBg: '#050606',
    size: 200,
    scrollThreshold: 0.22,
    side: 'right',
  },
  {
    key: 'jupiter',
    label: 'JUPITER',
    color: '#C17F3E',
    labelColor: '#F97316',
    hoverBg: '#060300',
    size: 400,
    scrollThreshold: 0.32,
    side: 'right',
  },
  {
    key: 'mars',
    label: 'MARS',
    color: '#C1440E',
    labelColor: '#F97316',
    hoverBg: '#060100',
    size: 300,
    scrollThreshold: 0.42,
    side: 'left',
  },
  {
    key: 'uranus',
    label: 'URANUS',
    color: '#7C3AED',
    labelColor: '#A78BFA',
    hoverBg: '#040106',
    size: 200,
    scrollThreshold: 0.51,
    side: 'right',
  },
  {
    key: 'neptune',
    label: 'NEPTUNE',
    color: '#3B5BDB',
    labelColor: '#93C5FD',
    hoverBg: '#010318',
    size: 460,
    scrollThreshold: 0.60,
    side: 'left',
  },
  {
    key: 'venus',
    label: 'VENUS',
    color: '#D9A84E',
    labelColor: '#FCD34D',
    hoverBg: '#060400',
    size: 180,
    scrollThreshold: 0.70,
    side: 'left',
  },
  {
    key: 'mercury',
    label: 'MERCURY',
    color: '#A0A0A0',
    labelColor: '#D1D5DB',
    hoverBg: '#040404',
    size: 120,
    scrollThreshold: 0.79,
    side: 'right',
  },
  {
    key: 'earth',
    label: 'EARTH',
    color: '#1B4FAD',
    labelColor: '#3B82F6',
    hoverBg: '#040B18',
    size: 680,
    scrollThreshold: 0,
    side: 'left',
  },
]

export const PLANET_MAP = Object.fromEntries(
  PLANETS_CONFIG.map((p) => [p.key, p])
) as Record<PlanetKey, PlanetConfig>

/** Scroll threshold where rocket scale-down begins (leaving Earth) */
export const LAUNCH_THRESHOLD = 0.05

/** Scroll threshold where rocket z-index switches for sun landing effect */
export const LANDING_THRESHOLD = 0.92

/** Total px the planets layer travels as scroll goes 0→1 */
export const SCENE_HEIGHT = 12000

/** Height of the invisible scroll-drive container in px */
export const SCROLL_DRIVE_HEIGHT = 8000

export const LOCALES = ['zh-TW', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'zh-TW'
