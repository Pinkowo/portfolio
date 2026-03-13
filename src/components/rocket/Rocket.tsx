import { motion, type MotionValue } from 'framer-motion'

interface RocketProps {
  scale: MotionValue<number>
  flameOpacity: MotionValue<number>
  className?: string
}

const W = 70
const H = 140

export function Rocket({ scale, flameOpacity, className }: RocketProps) {
  const wingW = Math.round(W * 0.3)
  const wingH = Math.round(H * 0.27)
  const windowR = Math.round(W * 0.27)
  const noseH = Math.round(H * 0.35)

  // Flame dimensions
  const flameW = Math.round(W * 0.78)
  const flameH = Math.round(H * 0.38)
  const coreW = Math.round(W * 0.48)
  const coreH = Math.round(H * 0.28)

  return (
    <motion.div
      className={`relative flex flex-col items-center ${className ?? ''}`}
      style={{ width: W, scale }}
    >
      {/* Nose */}
      <div
        style={{
          width: W * 0.5,
          height: noseH,
          background: '#F1F5F9',
          borderRadius: `${W * 0.25}px ${W * 0.25}px 0 0`,
        }}
      />

      {/* Body + wings */}
      <div className="relative flex items-center" style={{ width: W, height: H * 0.45 }}>
        <div
          className="absolute left-0"
          style={{ width: wingW, height: wingH, background: '#CBD5E1', borderRadius: '4px 0 4px 4px', bottom: 0 }}
        />
        <div
          className="mx-auto relative flex items-center justify-center"
          style={{ width: W * 0.5, height: H * 0.45, background: '#F1F5F9' }}
        >
          <div
            className="rounded-full"
            style={{ width: windowR, height: windowR, background: '#06B6D4', boxShadow: '0 0 8px #06B6D4' }}
          />
        </div>
        <div
          className="absolute right-0"
          style={{ width: wingW, height: wingH, background: '#CBD5E1', borderRadius: '0 4px 4px 4px', bottom: 0 }}
        />
      </div>

      {/* Flame — fades out when landed on Earth or Sun */}
      <motion.div
        style={{ opacity: flameOpacity, width: flameW, height: flameH }}
        className="relative flex items-start justify-center"
      >
        {/* Outer glow — very slow, subtle breathing */}
        <motion.div
          className="absolute"
          animate={{ scaleY: [1, 1.06, 0.97, 1.04, 1], opacity: [0.7, 0.9, 0.65, 0.85, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{
            width: flameW,
            height: flameH,
            background: 'radial-gradient(ellipse at top, #FB923C 0%, #EF4444 60%, transparent 100%)',
            borderRadius: '0 0 50% 50%',
            transformOrigin: 'top center',
          }}
        />
        {/* Mid flame */}
        <motion.div
          className="absolute"
          animate={{ scaleY: [1, 1.08, 0.94, 1.05, 0.98, 1] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
          style={{
            width: flameW * 0.8,
            height: flameH * 0.9,
            background: 'radial-gradient(ellipse at top, #F97316 0%, #DC2626 70%, transparent 100%)',
            borderRadius: '0 0 50% 50%',
            transformOrigin: 'top center',
          }}
        />
        {/* Inner core — brightest, least movement */}
        <motion.div
          className="absolute"
          animate={{ scaleY: [1, 1.04, 0.97, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.35 }}
          style={{
            width: coreW,
            height: coreH,
            background: 'radial-gradient(ellipse at top, #FEF3C7 0%, #FDE68A 50%, #F97316 100%)',
            borderRadius: '0 0 50% 50%',
            top: 0,
            transformOrigin: 'top center',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
