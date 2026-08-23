<template>
  <div
    class="flex gap-4 bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 touch-manipulation"
    :class="[
      layoutClass,
      { 'ring-2 ring-primary-500 bg-primary-50': isWinner },
      { 'ring-2 ring-orange-500 bg-orange-50': isInObrigacao && !isWinner },
      { 'ring-1 ring-primary-300': isLeading && !isWinner && !isInObrigacao },
    ]"
  >
    <div
      class="flex items-center justify-between"
      :class="{ 'flex-col space-y-2': layout === 'vertical' }"
    >
      <!-- Team name and status -->
      <div class="flex items-center space-x-2">
        <div class="text-lg font-semibold text-gray-900">{{ teamName }}</div>
        <div v-if="isWinner" class="text-lg animate-bounce-subtle">👑</div>
        <div
          v-else-if="isInObrigacao"
          class="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium"
        >
          Obrigação
        </div>
        <div
          v-else-if="isLeading"
          class="text-sm px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium"
        >
          Liderando
        </div>
      </div>

      <!-- Score display -->
      <div class="text-right" :class="{ 'text-center': layout === 'vertical' }">
        <div class="text-3xl font-bold" :class="scoreColorClass">
          {{ animatedScore }}
        </div>
        <div class="text-sm text-gray-500">{{ Math.round(progressPercentage) }}% da meta</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-500 ease-out"
          :class="progressBarClass"
          :style="{ width: `${progressPercentage}%` }"
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
  progressPercentage: number
  isWinner?: boolean
  layout?: 'horizontal' | 'vertical'
  isLeading?: boolean
  isInObrigacao?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isWinner: false,
  layout: 'vertical',
  isLeading: false,
  isInObrigacao: false,
})

// Animate score changes
const scoreRef = ref(props.score)
const animatedScore = useTransition(scoreRef, {
  duration: 500,
  transition: [0.4, 0, 0.2, 1],
})

watch(
  () => props.score,
  (newScore) => {
    scoreRef.value = newScore
  },
)

const layoutClass = computed(() => {
  return props.layout === 'horizontal' ? 'flex-row' : 'flex-col'
})

const scoreColorClass = computed(() => {
  if (props.isWinner) return 'text-primary-600'
  if (props.isInObrigacao) return 'text-orange-600'
  if (props.isLeading) return 'text-primary-600'
  return 'text-gray-900'
})

const progressBarClass = computed(() => {
  if (props.isWinner) return 'bg-primary-500'
  if (props.isInObrigacao) return 'bg-orange-500'
  if (props.progressPercentage >= 80) return 'bg-accent-500'
  if (props.progressPercentage >= 50) return 'bg-primary-400'
  return 'bg-primary-300'
})
</script>
