<template>
  <header class="sticky top-0 z-50 glassmorphism safe-top transition-all duration-300">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo and title -->
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img src="@/assets/logo.svg" alt="Canastra" class="h-8 w-8 animate-bounce-subtle" />
            <div
              v-if="hasActiveGame"
              class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
            ></div>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">Marcador de Canastra</h1>
            <p v-if="hasActiveGame" class="text-xs text-gray-600">{{ gameStatus }}</p>
          </div>
        </div>

        <!-- Game summary (when active) -->
        <div v-if="hasActiveGame" class="flex space-x-2">
          <div v-for="(total, index) in store.totals" :key="index" class="text-center">
            <div class="text-xs font-medium text-gray-600">{{ store.names[index] }}</div>
            <div class="text-sm font-bold" :class="getScoreColor(total)">{{ total }}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanastraStore } from '@/stores/canastra'

const store = useCanastraStore()

const hasActiveGame = computed(() => store.teams > 0)

const gameStatus = computed(() => {
  const totalRounds = store.rounds.length
  if (totalRounds === 0) return 'Jogo iniciado'
  return `${totalRounds} rodada${totalRounds !== 1 ? 's' : ''}`
})

const getScoreColor = (score: number) => {
  const isWinning = score >= store.winningPoints
  const isLeading = score === Math.max(...store.totals)

  if (isWinning) return 'text-green-600'
  if (isLeading && store.totals.filter((t) => t === score).length === 1) return 'text-primary-600'
  return 'text-gray-900'
}
</script>
