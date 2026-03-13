import { describe, it, expect } from 'vitest'
import { SCENE_HEIGHT, LANDING_THRESHOLD, LAUNCH_THRESHOLD } from '@/lib/constants'

/** Mirror of the rocketScale keyframe logic in useScrollRocket */
function getRocketScale(progress: number): number {
  const input = [0, 0.08, 0.85, 1.0]
  const output = [1.8, 1.0, 1.0, 2.2]
  if (progress <= input[0]) return output[0]
  if (progress >= input[input.length - 1]) return output[output.length - 1]
  for (let i = 1; i < input.length; i++) {
    if (progress <= input[i]) {
      const t = (progress - input[i - 1]) / (input[i] - input[i - 1])
      return output[i - 1] + t * (output[i] - output[i - 1])
    }
  }
  return 1.0
}

/** Mirror of planetsY computation */
function getPlanetsY(progress: number): number {
  return progress * SCENE_HEIGHT
}

/** Mirror of isLanding logic */
function getIsLanding(progress: number): boolean {
  return progress > LANDING_THRESHOLD
}

describe('getPlanetsY', () => {
  it('returns 0 at scroll 0%', () => {
    expect(getPlanetsY(0)).toBe(0)
  })
  it('returns SCENE_HEIGHT at scroll 100%', () => {
    expect(getPlanetsY(1)).toBe(SCENE_HEIGHT)
  })
  it('returns half SCENE_HEIGHT at scroll 50%', () => {
    expect(getPlanetsY(0.5)).toBe(SCENE_HEIGHT / 2)
  })
})

describe('getRocketScale', () => {
  it('is 1.8 at scroll 0% (on Earth)', () => {
    expect(getRocketScale(0)).toBeCloseTo(1.8)
  })
  it('is 1.0 at scroll 8% (just left Earth)', () => {
    expect(getRocketScale(0.08)).toBeCloseTo(1.0)
  })
  it('is 1.0 at scroll 50% (mid flight)', () => {
    expect(getRocketScale(0.5)).toBeCloseTo(1.0)
  })
  it('is 1.0 at scroll 85% (approaching Sun)', () => {
    expect(getRocketScale(0.85)).toBeCloseTo(1.0)
  })
  it('is 2.2 at scroll 100% (at Sun)', () => {
    expect(getRocketScale(1.0)).toBeCloseTo(2.2)
  })
  it('grows continuously from 85% to 100%', () => {
    expect(getRocketScale(0.925)).toBeGreaterThan(1.0)
    expect(getRocketScale(0.925)).toBeLessThan(2.2)
  })
})

describe('getIsLanding', () => {
  it('is false at scroll 0%', () => {
    expect(getIsLanding(0)).toBe(false)
  })
  it('is false at scroll 90%', () => {
    expect(getIsLanding(0.9)).toBe(false)
  })
  it('is false exactly at LANDING_THRESHOLD', () => {
    expect(getIsLanding(LANDING_THRESHOLD)).toBe(false)
  })
  it('is true just above LANDING_THRESHOLD', () => {
    expect(getIsLanding(LANDING_THRESHOLD + 0.001)).toBe(true)
  })
  it('is true at scroll 100%', () => {
    expect(getIsLanding(1)).toBe(true)
  })
})

describe('constants', () => {
  it('SCENE_HEIGHT is positive', () => {
    expect(SCENE_HEIGHT).toBeGreaterThan(0)
  })
  it('LAUNCH_THRESHOLD is between 0 and 0.1', () => {
    expect(LAUNCH_THRESHOLD).toBeGreaterThan(0)
    expect(LAUNCH_THRESHOLD).toBeLessThan(0.1)
  })
  it('LANDING_THRESHOLD is between 0.8 and 1', () => {
    expect(LANDING_THRESHOLD).toBeGreaterThan(0.8)
    expect(LANDING_THRESHOLD).toBeLessThan(1)
  })
})
