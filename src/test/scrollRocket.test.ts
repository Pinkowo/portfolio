import { describe, it, expect } from 'vitest'
import { ROCKET_THRESHOLDS } from '@/lib/constants'

function getRocketSizeIndex(progress: number): number {
  let idx = 0
  for (let i = ROCKET_THRESHOLDS.length - 1; i >= 0; i--) {
    if (progress >= ROCKET_THRESHOLDS[i]) {
      idx = i
      break
    }
  }
  return idx
}

describe('getRocketSizeIndex', () => {
  it('returns 0 at scroll 0%', () => {
    expect(getRocketSizeIndex(0)).toBe(0)
  })
  it('returns 1 at scroll 20%', () => {
    expect(getRocketSizeIndex(0.2)).toBe(1)
  })
  it('returns 2 at scroll 40%', () => {
    expect(getRocketSizeIndex(0.4)).toBe(2)
  })
  it('returns 3 at scroll 60%', () => {
    expect(getRocketSizeIndex(0.6)).toBe(3)
  })
  it('returns 4 at scroll 80%', () => {
    expect(getRocketSizeIndex(0.8)).toBe(4)
  })
  it('returns 4 at scroll 100%', () => {
    expect(getRocketSizeIndex(1)).toBe(4)
  })
  it('returns 0 at scroll 19%', () => {
    expect(getRocketSizeIndex(0.19)).toBe(0)
  })
})
