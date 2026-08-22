import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  useCanastraStore,
  InvalidGameConfigError,
  InvalidRoundError,
  InvalidRoundIndexError,
} from '@/stores/canastra'

const validConfig = {
  teams: 2,
  names: ['Nós', 'Eles'],
  winningPoints: 3000,
  obrigacaoPoints: 1500,
}

describe('canastra store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has default state', () => {
    const store = useCanastraStore()
    expect(store.teams).toBe(0)
    expect(store.rounds).toEqual([])
    expect(store.winningPoints).toBe(3000)
    expect(store.obrigacaoPoints).toBe(1500)
  })

  describe('startGame', () => {
    it('sets state for a valid config', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      expect(store.teams).toBe(2)
      expect(store.names).toEqual(['Nós', 'Eles'])
      expect(store.winningPoints).toBe(3000)
      expect(store.obrigacaoPoints).toBe(1500)
    })

    it('throws when teams is out of range', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, teams: 4, names: ['A', 'B', 'C', 'D'] }),
      ).toThrow(InvalidGameConfigError)
    })

    it('throws when names length does not match teams', () => {
      const store = useCanastraStore()
      expect(() => store.startGame({ ...validConfig, names: ['A'] })).toThrow(
        InvalidGameConfigError,
      )
    })

    it('throws when a name is empty', () => {
      const store = useCanastraStore()
      expect(() => store.startGame({ ...validConfig, names: ['A', '  '] })).toThrow(
        InvalidGameConfigError,
      )
    })

    it('throws when obrigacaoPoints exceeds winningPoints', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, winningPoints: 1000, obrigacaoPoints: 1500 }),
      ).toThrow(InvalidGameConfigError)
    })

    it('throws when winningPoints is below the minimum', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, winningPoints: 50, obrigacaoPoints: 10 }),
      ).toThrow(InvalidGameConfigError)
    })
  })

  describe('addRound', () => {
    beforeEach(() => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
    })

    it('pushes a valid round and updates totals', () => {
      const store = useCanastraStore()
      store.addRound([100, -50])
      expect(store.rounds).toEqual([[100, -50]])
      expect(store.totals).toEqual([100, -50])
    })

    it('rejects NaN input and leaves rounds unchanged', () => {
      const store = useCanastraStore()
      expect(() => store.addRound([NaN, 10])).toThrow(InvalidRoundError)
      expect(store.rounds).toEqual([])
    })

    it('rejects Infinity input and leaves rounds unchanged', () => {
      const store = useCanastraStore()
      expect(() => store.addRound([Infinity, 10])).toThrow(InvalidRoundError)
      expect(store.rounds).toEqual([])
    })

    it('rejects a wrong team count and leaves rounds unchanged', () => {
      const store = useCanastraStore()
      expect(() => store.addRound([10])).toThrow(InvalidRoundError)
      expect(store.rounds).toEqual([])
    })
  })

  describe('addRound before startGame', () => {
    it('rejects an empty round when no game has started', () => {
      const store = useCanastraStore()
      store.reset()
      expect(() => store.addRound([])).toThrow(InvalidRoundError)
      expect(store.rounds).toEqual([])
    })
  })

  describe('removeRound', () => {
    beforeEach(() => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([10, 20])
      store.addRound([5, 5])
    })

    it('removes a valid index', () => {
      const store = useCanastraStore()
      store.removeRound(0)
      expect(store.rounds).toEqual([[5, 5]])
    })

    it('throws for a negative index and leaves rounds unchanged', () => {
      const store = useCanastraStore()
      expect(() => store.removeRound(-1)).toThrow(InvalidRoundIndexError)
      expect(store.rounds.length).toBe(2)
    })

    it('throws for an out-of-range index and leaves rounds unchanged', () => {
      const store = useCanastraStore()
      expect(() => store.removeRound(5)).toThrow(InvalidRoundIndexError)
      expect(store.rounds.length).toBe(2)
    })
  })

  describe('revanche and reset', () => {
    it('revanche clears rounds but keeps the game configuration', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([10, 20])
      store.revanche()
      expect(store.rounds).toEqual([])
      expect(store.teams).toBe(2)
    })

    it('reset returns the store to its defaults', () => {
      const store = useCanastraStore()
      store.startGame({ teams: 3, names: ['A', 'B', 'C'], winningPoints: 2500, obrigacaoPoints: 1000 })
      store.reset()
      expect(store.teams).toBe(0)
      expect(store.winningPoints).toBe(3000)
      expect(store.obrigacaoPoints).toBe(1500)
    })
  })
})
