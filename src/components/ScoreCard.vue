<template>
  <div
    class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 touch-manipulation"
    :class="[
      layoutClass,
      { 'ring-2 ring-green-500 bg-green-50': isWinner },
      { 'ring-2 ring-orange-500 bg-orange-50': isInObrigacao && !isWinner },
      { 'ring-1 ring-primary-300': isLeading && !isWinner && !isInObrigacao }
    ]"
  >
    <div class="flex items-center justify-between" :class="{ 'flex-col space-y-2': layout === 'vertical' }">
      <!-- Team name and status -->
      <div class="flex items-center space-x-2">
        <div class="text-lg font-semibold text-gray-900">{{ teamName }}</div>
        <div v-if="isWinner" class="text-lg animate-bounce-subtle">👑</div>
        <div v-else-if="isInObrigacao" class="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
          Obrigação
        </div>
        <div v-else-if="isLeading" class="text-sm px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
          Liderando
        </div>
      </div>

      <!-- Score display -->
      <div class="text-right" :class="{ 'text-center': layout === 'vertical' }">
        <div class="text-3xl font-bold" :class="scoreColorClass">
          {{ animatedScore }}
        </div>
        <div class="text-sm text-gray-500">
          {{ Math.ceil((score / winningPoints) * 100) }}% da meta
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-500 ease-out"
          :class="progressBarClass"
          :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTransition } from '@vueuse/core'

interface Props {
  teamName: string
  score: number
  winningPoints: number
  obrigacaoPoints?: number
  isWinner?: boolean
  layout?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  obrigacaoPoints: 1500,
  isWinner: false,
  layout: 'vertical'
})

// Animate score changes
const scoreRef = ref(props.score)
const animatedScore = useTransition(scoreRef, {
  duration: 500,
  transition: [0.4, 0, 0.2, 1]
})

watch(() => props.score, (newScore) => {
  scoreRef.value = newScore
})

const isLeading = computed(() => {
  return props.score > 0 && !props.isWinner
})

const isInObrigacao = computed(() => {
  return props.score >= props.obrigacaoPoints && !props.isWinner
})

const progressPercentage = computed(() => {
  return Math.min((props.score / props.winningPoints) * 100, 100)
})

const layoutClass = computed(() => {
  return props.layout === 'horizontal' ? 'flex-row' : 'flex-col'
})

const scoreColorClass = computed(() => {
  if (props.isWinner) return 'text-green-600'
  if (isInObrigacao.value) return 'text-orange-600'
  if (isLeading.value) return 'text-primary-600'
  return 'text-gray-900'
})

const progressBarClass = computed(() => {
  if (props.isWinner) return 'bg-green-500'
  if (isInObrigacao.value) return 'bg-orange-500'
  if (progressPercentage.value >= 80) return 'bg-accent-500'
  if (progressPercentage.value >= 50) return 'bg-primary-400'
  return 'bg-primary-300'
})
</script>
