import { ROCKET_SIZES } from '@/lib/constants'

export type RocketSizeIndex = 0 | 1 | 2 | 3 | 4

interface RocketProps {
  sizeIndex: RocketSizeIndex
  className?: string
}

export function Rocket({ sizeIndex, className }: RocketProps) {
  const { w, h } = ROCKET_SIZES[sizeIndex]
  const isFinal = sizeIndex === 4

  const bodyColor = isFinal ? '#F8FAFC' : '#F1F5F9'
  const wingColor = isFinal ? '#E2E8F0' : '#CBD5E1'

  const wingW = Math.round(w * 0.3)
  const wingH = Math.round(h * 0.27)
  const windowR = Math.round(w * 0.27)
  const flameW = Math.round(w * 0.82)
  const flameH = Math.round(h * 0.39)
  const flameCoreW = Math.round(w * 0.55)
  const flameCoreH = Math.round(h * 0.32)
  const noseH = Math.round(h * 0.35)

  return (
    <div className={`relative flex flex-col items-center ${className ?? ''}`} style={{ width: w }}>
      {/* Nose */}
      <div
        style={{
          width: w * 0.5,
          height: noseH,
          background: bodyColor,
          borderRadius: `${w * 0.25}px ${w * 0.25}px 0 0`,
        }}
      />
      {/* Body + wings */}
      <div className="relative flex items-center" style={{ width: w, height: h * 0.45 }}>
        {/* Left wing */}
        <div
          className="absolute left-0"
          style={{ width: wingW, height: wingH, background: wingColor, borderRadius: '4px 0 4px 4px', bottom: 0 }}
        />
        {/* Body */}
        <div
          className="mx-auto relative flex items-center justify-center"
          style={{ width: w * 0.5, height: h * 0.45, background: bodyColor }}
        >
          {/* Window */}
          <div
            className="rounded-full"
            style={{ width: windowR, height: windowR, background: '#06B6D4', boxShadow: '0 0 8px #06B6D4' }}
          />
        </div>
        {/* Right wing */}
        <div
          className="absolute right-0"
          style={{ width: wingW, height: wingH, background: wingColor, borderRadius: '0 4px 4px 4px', bottom: 0 }}
        />
      </div>
      {/* Flame */}
      <div className="relative flex items-start justify-center" style={{ width: flameW, height: flameH }}>
        <div
          className="absolute"
          style={{
            width: flameW,
            height: flameH,
            background: '#F97316',
            borderRadius: '0 0 50% 50%',
            opacity: 0.9,
          }}
        />
        <div
          className="absolute"
          style={{
            width: flameCoreW,
            height: flameCoreH,
            background: '#FDE68A',
            borderRadius: '0 0 50% 50%',
            top: 0,
          }}
        />
      </div>
    </div>
  )
}
