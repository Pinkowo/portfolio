import { motion, type MotionValue } from 'framer-motion'

interface RocketProps {
  scale: MotionValue<number>
  flameOpacity: MotionValue<number>
  className?: string
}

const W = 70    // body width
const H = 140   // body height

const NOSE_H = 90
const FIN_W = 44
const FIN_H = 75
const NOZ_W = 92
const NOZ_H = 36
const WIN_R = 36

// Nozzle clip-path: top edge = body width (W), bottom edge = NOZ_W
const NOZ_INSET = (((NOZ_W - W) / 2) / NOZ_W * 100).toFixed(2)
const NOZ_CLIP = `polygon(${NOZ_INSET}% 0%, ${(100 - parseFloat(NOZ_INSET)).toFixed(2)}% 0%, 100% 100%, 0% 100%)`

export function Rocket({ scale, flameOpacity, className }: RocketProps) {
  const flameW = 60
  const flameH = 74
  const coreW = 26
  const coreH = 52

  return (
    <motion.div
      className={`relative flex flex-col items-center ${className ?? ''}`}
      style={{ width: W, scale, overflow: 'visible' }}
    >
      {/* ── Nose cone — sharp isoceles triangle ── */}
      <div
        style={{
          width: W,
          height: NOSE_H,
          background: '#E2E8F0',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          marginBottom: -2,
        }}
      />

      {/* ── Body + swept fins ── */}
      <div style={{ position: 'relative', width: W, height: H }}>
        {/* Left fin */}
        <div
          style={{
            position: 'absolute',
            right: '100%',
            bottom: -25,
            width: FIN_W,
            height: FIN_H,
            background: '#CBD5E1',
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          }}
        />

        {/* Body */}
        <div
          style={{
            width: W,
            height: H,
            background: '#F1F5F9',
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Accent stripe */}
          <div
            style={{
              position: 'absolute',
              top: 42,
              left: 0,
              right: 0,
              height: 8,
              background: '#CBD5E1',
            }}
          />
          {/* Window */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: WIN_R,
              height: WIN_R,
              borderRadius: '50%',
              background: '#06B6D4',
              boxShadow: '0 0 8px #06B6D4',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#E0F2FE',
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* Right fin */}
        <div
          style={{
            position: 'absolute',
            left: '100%',
            bottom: -25,
            width: FIN_W,
            height: FIN_H,
            background: '#CBD5E1',
            clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>

      {/* ── Nozzle bell — trapezoid wider at base ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: NOZ_W,
          height: NOZ_H,
          background: '#94A3B8',
          clipPath: NOZ_CLIP,
          marginTop: -4,
        }}
      />

      {/* ── Flame ── */}
      <motion.div
        style={{ opacity: flameOpacity, width: flameW, height: flameH }}
        className="relative flex items-start justify-center"
      >
        {/* Outer glow */}
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
        {/* Inner core */}
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
