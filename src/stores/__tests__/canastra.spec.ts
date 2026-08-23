import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick, createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
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
      store.startGame({
        teams: 3,
        names: ['A', 'B', 'C'],
        winningPoints: 2500,
        obrigacaoPoints: 1000,
      })
      store.reset()
      expect(store.teams).toBe(0)
      expect(store.winningPoints).toBe(3000)
      expect(store.obrigacaoPoints).toBe(1500)
    })
  })

  describe('game rules getters', () => {
    it('hasActiveGame is false before a game starts and true after', () => {
      const store = useCanastraStore()
      expect(store.hasActiveGame).toBe(false)
      store.startGame({ ...validConfig })
      expect(store.hasActiveGame).toBe(true)
    })

    it('derives winners, leaders and obrigação from totals', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([3200, 2000])

      expect(store.isWinner(0)).toBe(true)
      expect(store.isWinner(1)).toBe(false)
      expect(store.isLeading(0)).toBe(true)
      expect(store.isLeading(1)).toBe(false)
      expect(store.isInObrigacao(0)).toBe(false)
      expect(store.isInObrigacao(1)).toBe(true)
      expect(store.winnerIndices).toEqual([0])
      expect(store.hasTieAtTop).toBe(false)
    })

    it('marks a tie at the top above threshold as no winner and a tie', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([3200, 3200])

      expect(store.winnerIndices).toEqual([])
      expect(store.hasTieAtTop).toBe(true)
      expect(store.isLeading(0)).toBe(false)
      expect(store.isLeading(1)).toBe(false)
    })

    it('reports a unique leader below threshold with no winner', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([1000, 500])

      expect(store.isLeading(0)).toBe(true)
      expect(store.isWinner(0)).toBe(false)
      expect(store.winnerIndices).toEqual([])
    })

    it('clamps progress to [0, 100] and guards invalid thresholds', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([-500, 4500])

      expect(store.progressFor(0)).toBe(0)
      expect(store.progressFor(1)).toBe(100)
    })
  })

  describe('startGame edge cases', () => {
    it('supports a three-team game', () => {
      const store = useCanastraStore()
      store.startGame({ teams: 3, names: ['A', 'B', 'C'], winningPoints: 3000, obrigacaoPoints: 1500 })
      expect(store.teams).toBe(3)
      expect(store.names).toEqual(['A', 'B', 'C'])
    })

    it('throws for a non-integer team count', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, teams: 2.5, names: ['A', 'B'] }),
      ).toThrow(InvalidGameConfigError)
    })

    it('throws when a name is not a non-empty string', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, names: ['A', 5 as unknown as string] }),
      ).toThrow(InvalidGameConfigError)
    })

    it('throws when winningPoints is NaN or Infinity', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, winningPoints: NaN }),
      ).toThrow(InvalidGameConfigError)
      expect(() =>
        store.startGame({ ...validConfig, winningPoints: Infinity, obrigacaoPoints: 10 }),
      ).toThrow(InvalidGameConfigError)
    })

    it('throws when obrigacaoPoints is zero or negative', () => {
      const store = useCanastraStore()
      expect(() =>
        store.startGame({ ...validConfig, obrigacaoPoints: 0 }),
      ).toThrow(InvalidGameConfigError)
      expect(() =>
        store.startGame({ ...validConfig, obrigacaoPoints: -10 }),
      ).toThrow(InvalidGameConfigError)
    })
  })

  describe('addRound edge cases', () => {
    beforeEach(() => {
      const store = useCanastraStore()
      store.startGame({ teams: 3, names: ['A', 'B', 'C'], winningPoints: 3000, obrigacaoPoints: 1500 })
    })

    it('accumulates totals across multiple rounds', () => {
      const store = useCanastraStore()
      store.addRound([100, 200, -50])
      store.addRound([50, 0, 50])
      expect(store.totals).toEqual([150, 200, 0])
    })

    it('accepts fractional and negative scores', () => {
      const store = useCanastraStore()
      store.addRound([10.5, -25.25, 0])
      expect(store.totals).toEqual([10.5, -25.25, 0])
    })

    it('removes a round in a three-team game', () => {
      const store = useCanastraStore()
      store.addRound([10, 20, 30])
      store.addRound([1, 2, 3])
      store.removeRound(0)
      expect(store.rounds).toEqual([[1, 2, 3]])
    })
  })

  describe('revanche and reset details', () => {
    it('revanche preserves team count, names and thresholds', () => {
      const store = useCanastraStore()
      store.startGame({ teams: 3, names: ['A', 'B', 'C'], winningPoints: 2500, obrigacaoPoints: 1000 })
      store.addRound([10, 20, 30])
      store.revanche()
      expect(store.rounds).toEqual([])
      expect(store.teams).toBe(3)
      expect(store.names).toEqual(['A', 'B', 'C'])
      expect(store.winningPoints).toBe(2500)
      expect(store.obrigacaoPoints).toBe(1000)
    })

    it('reset clears names and rounds back to defaults', () => {
      const store = useCanastraStore()
      store.startGame({ teams: 3, names: ['A', 'B', 'C'], winningPoints: 2500, obrigacaoPoints: 1000 })
      store.addRound([10, 20, 30])
      store.reset()
      expect(store.teams).toBe(0)
      expect(store.names).toEqual(['', ''])
      expect(store.rounds).toEqual([])
      expect(store.winningPoints).toBe(3000)
      expect(store.obrigacaoPoints).toBe(1500)
    })
  })

  describe('threshold boundary getters', () => {
    it('marks a team at exactly the winning threshold as winner', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([3000, 1000])
      expect(store.isWinner(0)).toBe(true)
      expect(store.winnerIndices).toEqual([0])
    })

    it('marks a team at exactly the obrigação threshold as in obrigação', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([1500, 100])
      expect(store.isInObrigacao(0)).toBe(true)
    })

    it('reports obrigação for negative totals (below threshold)', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([-200, -100])
      expect(store.isInObrigacao(0)).toBe(false)
      expect(store.isLeading(0)).toBe(false)
    })

    it('returns false for out-of-range getter indices without throwing', () => {
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([100, 200])
      expect(store.isWinner(5)).toBe(false)
      expect(store.isLeading(5)).toBe(false)
      expect(store.isInObrigacao(5)).toBe(false)
      expect(() => store.progressFor(5)).not.toThrow()
    })
  })

  describe('persistence', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('writes the store state to localStorage', async () => {
      const pinia = createPinia()
      pinia.use(piniaPluginPersistedstate)
      createApp(() => {}).use(pinia)
      setActivePinia(pinia)
      const store = useCanastraStore()
      store.startGame({ ...validConfig })
      store.addRound([10, 20])
      await nextTick()

      const raw = localStorage.getItem('scores')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw as string)
      expect(parsed.rounds).toEqual([[10, 20]])
      expect(parsed.teams).toBe(2)
    })

    it('hydrates state from localStorage on a fresh store', async () => {
      localStorage.setItem(
        'scores',
        JSON.stringify({
          teams: 2,
          names: ['A', 'B'],
          rounds: [[100, 200]],
          winningPoints: 3000,
          obrigacaoPoints: 1500,
        }),
      )
      const pinia = createPinia()
      pinia.use(piniaPluginPersistedstate)
      createApp(() => {}).use(pinia)
      setActivePinia(pinia)
      const store = useCanastraStore()
      await nextTick()

      expect(store.teams).toBe(2)
      expect(store.names).toEqual(['A', 'B'])
      expect(store.rounds).toEqual([[100, 200]])
      expect(store.totals).toEqual([100, 200])
    })
  })
})
