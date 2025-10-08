import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCanastraStore = defineStore('scores', () => {
  // State
  const teams = ref<number>(0)
  const names = ref<string[]>(new Array(2).fill(''))
  const rounds = ref<number[][]>([])
  const winningPoints = ref<number>(3000)

  // Getters
  const totals = computed((): number[] => {
    const totalsArray: number[] = []
    for (let i = 0; i < teams.value; i++) {
      totalsArray[i] = rounds.value.reduce((accumulator, round) => accumulator + (round[i] || 0), 0)
    }
    return totalsArray
  })

  // Actions
  function reset() {
    teams.value = 0
    names.value = new Array(2).fill('')
    rounds.value = []
    winningPoints.value = 3000
  }

  function revanche() {
    rounds.value = []
  }

  function addScore(scores: number[]) {
    if (!scores || scores.length !== teams.value) {
      console.error('Scores provided do not match teams playing')
      return
    }
    rounds.value.push(scores)
  }

  function removeScore(row: number) {
    rounds.value.splice(row, 1)
  }

  return {
    teams,
    names,
    rounds,
    winningPoints,
    totals,
    reset,
    revanche,
    addScore,
    removeScore,
  }
}, {
  persist: true,
})
