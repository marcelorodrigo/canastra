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
              class="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"
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
            <div class="text-sm font-bold" :class="getScoreColor(index)">{{ total }}</div>
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

const hasActiveGame = computed(() => store.hasActiveGame)

const gameStatus = computed(() => {
  const totalRounds = store.rounds.length
  if (totalRounds === 0) return 'Jogo iniciado'
  return `${totalRounds} rodada${totalRounds !== 1 ? 's' : ''}`
})

const getScoreColor = (index: number) => {
  if (store.isWinner(index)) return 'text-primary-700'
  if (store.isLeading(index)) return 'text-primary-700'
  return 'text-gray-900'
}
</script>
