import { describe, it, expect } from 'vitest'
import {
  computeMaxTotal,
  computeLeaderIndices,
  computeWinnerIndices,
  computeHasTieAtTop,
  computeIsInObrigacao,
  computeProgress,
} from '@/stores/gameRules'

describe('gameRules', () => {
  describe('computeMaxTotal', () => {
    it('returns the highest total', () => {
      expect(computeMaxTotal([100, 500, 300])).toBe(500)
    })

    it('handles negative totals', () => {
      expect(computeMaxTotal([-200, -50, -300])).toBe(-50)
    })

    it('returns -Infinity for an empty list', () => {
      expect(computeMaxTotal([])).toBe(-Infinity)
    })
  })

  describe('computeLeaderIndices', () => {
    it('returns the index of the unique leader', () => {
      expect(computeLeaderIndices([100, 500, 300])).toEqual([1])
    })

    it('returns all indices tied for the max', () => {
      expect(computeLeaderIndices([500, 300, 500])).toEqual([0, 2])
    })

    it('returns an empty list for an empty totals array', () => {
      expect(computeLeaderIndices([])).toEqual([])
    })
  })

  describe('computeWinnerIndices', () => {
    it('returns the unique leader above the threshold', () => {
      expect(computeWinnerIndices([1000, 3200], 3000)).toEqual([1])
    })

    it('returns no winner when nobody reached the threshold', () => {
      expect(computeWinnerIndices([1000, 2900], 3000)).toEqual([])
    })

    it('returns no winner on a tie at the top above the threshold', () => {
      expect(computeWinnerIndices([3200, 3200], 3000)).toEqual([])
    })

    it('returns no winner on a tie at the top below the threshold', () => {
      expect(computeWinnerIndices([500, 500], 3000)).toEqual([])
    })

    it('prefers the unique higher scorer when one team is above threshold and another tied-below is not the max', () => {
      expect(computeWinnerIndices([3200, 3100], 3000)).toEqual([0])
    })
  })

  describe('computeHasTieAtTop', () => {
    it('is true when multiple teams share the max total', () => {
      expect(computeHasTieAtTop([500, 500, 100])).toBe(true)
    })

    it('is false for a unique leader', () => {
      expect(computeHasTieAtTop([500, 100, 200])).toBe(false)
    })

    it('is false for an empty list', () => {
      expect(computeHasTieAtTop([])).toBe(false)
    })
  })

  describe('computeIsInObrigacao', () => {
    it('is true at or above obrigação and below winning threshold', () => {
      expect(computeIsInObrigacao(1500, 1500, 3000)).toBe(true)
      expect(computeIsInObrigacao(2000, 1500, 3000)).toBe(true)
    })

    it('is false below obrigação', () => {
      expect(computeIsInObrigacao(1400, 1500, 3000)).toBe(false)
    })

    it('is false at or above the winning threshold (winner takes precedence)', () => {
      expect(computeIsInObrigacao(3000, 1500, 3000)).toBe(false)
      expect(computeIsInObrigacao(3500, 1500, 3000)).toBe(false)
    })
  })

  describe('computeProgress', () => {
    it('returns the clamped positive percentage', () => {
      expect(computeProgress(1500, 3000)).toBe(50)
      expect(computeProgress(3000, 3000)).toBe(100)
    })

    it('clamps to 100 for scores above the threshold', () => {
      expect(computeProgress(4500, 3000)).toBe(100)
    })

    it('clamps negative scores to 0', () => {
      expect(computeProgress(-500, 3000)).toBe(0)
    })

    it('returns 0 for a non-positive winning points threshold', () => {
      expect(computeProgress(1500, 0)).toBe(0)
      expect(computeProgress(1500, -100)).toBe(0)
    })
  })
})
