import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GameConfig {
  teams: number
  names: string[]
  winningPoints: number
  obrigacaoPoints: number
}

export class InvalidGameConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidGameConfigError'
  }
}

export class InvalidRoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRoundError'
  }
}

export class InvalidRoundIndexError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRoundIndexError'
  }
}

export const useCanastraStore = defineStore(
  'scores',
  () => {
    // State
    const teams = ref<number>(0)
    const names = ref<string[]>(new Array(2).fill(''))
    const rounds = ref<number[][]>([])
    const winningPoints = ref<number>(3000)
    const obrigacaoPoints = ref<number>(1500)

    // Getters
    const totals = computed((): number[] => {
      const totalsArray: number[] = []
      for (let i = 0; i < teams.value; i++) {
        totalsArray[i] = rounds.value.reduce(
          (accumulator, round) => accumulator + (round[i] || 0),
          0,
        )
      }
      return totalsArray
    })

    // Actions
    function reset() {
      teams.value = 0
      names.value = new Array(2).fill('')
      rounds.value = []
      winningPoints.value = 3000
      obrigacaoPoints.value = 1500
    }

    function revanche() {
      rounds.value = []
    }

    function startGame(config: GameConfig) {
      if (!Number.isInteger(config.teams) || config.teams < 2 || config.teams > 3) {
        throw new InvalidGameConfigError('Teams must be an integer between 2 and 3')
      }
      if (!Array.isArray(config.names) || config.names.length !== config.teams) {
        throw new InvalidGameConfigError('Names length must match the number of teams')
      }
      if (!config.names.every((name) => typeof name === 'string' && name.trim().length > 0)) {
        throw new InvalidGameConfigError('Every team name must be a non-empty string')
      }
      if (!Number.isFinite(config.winningPoints) || config.winningPoints < 100) {
        throw new InvalidGameConfigError('Winning points must be a finite number >= 100')
      }
      if (
        !Number.isFinite(config.obrigacaoPoints) ||
        config.obrigacaoPoints <= 0 ||
        config.obrigacaoPoints > config.winningPoints
      ) {
        throw new InvalidGameConfigError(
          'Obrigação points must be finite, greater than 0 and not above winning points',
        )
      }

      teams.value = config.teams
      names.value = [...config.names]
      winningPoints.value = config.winningPoints
      obrigacaoPoints.value = config.obrigacaoPoints
    }

    function addRound(scores: number[]) {
      if (teams.value < 2 || teams.value > 3) {
        throw new InvalidRoundError('A valid two- or three-team game must be started first')
      }
      if (!Array.isArray(scores) || scores.length !== teams.value) {
        throw new InvalidRoundError('Scores length must match the number of teams')
      }
      if (!scores.every((score) => Number.isFinite(score))) {
        throw new InvalidRoundError('Every score must be a finite number')
      }
      rounds.value.push([...scores])
    }

    function removeRound(index: number) {
      if (!Number.isInteger(index) || index < 0 || index >= rounds.value.length) {
        throw new InvalidRoundIndexError('Round index is out of range')
      }
      rounds.value.splice(index, 1)
    }

    return {
      teams,
      names,
      rounds,
      winningPoints,
      obrigacaoPoints,
      totals,
      reset,
      revanche,
      startGame,
      addRound,
      removeRound,
    }
  },
  {
    persist: true,
  },
)
