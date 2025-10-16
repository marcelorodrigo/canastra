<template>
  <div
    ref="cardRef"
    class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 relative"
    :class="{ 'transform -translate-x-20 opacity-50': isSwipedLeft }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Swipe action background -->
    <div
      v-if="isSwipedLeft"
      class="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-red-500"
    >
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </div>

    <!-- Card content -->
    <div class="relative p-4">
      <!-- Round header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
            {{ roundNumber }}
          </div>
          <div class="text-sm text-gray-600">Rodada {{ roundNumber }}</div>
        </div>
      </div>

      <!-- Team scores -->
      <div class="grid gap-3" :class="gridClass">
        <div
          v-for="(score, index) in round"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <span class="text-sm font-medium text-gray-700">{{ teamNames[index] ?? '' }}</span>
          <span
            class="text-lg font-bold animate-count-up"
            :class="getScoreClass(score)"
          >
            {{ score > 0 ? '+' : '' }}{{ score }}
          </span>
        </div>
      </div>

      <!-- Delete button (always visible for now) -->
      <button
        @click="$emit('delete')"
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  round: number[]
  roundNumber: number
  teamNames: string[]
}

const props = defineProps<Props>()

defineEmits<{
  delete: []
}>()

const cardRef = ref<HTMLElement>()
const isSwipedLeft = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)

// Native touch event handlers for swipe gesture
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.changedTouches[0];
  if (!touch) return;
  touchStartX.value = touch.screenX;
}

const handleTouchMove = (e: TouchEvent) => {
  const touch = e.changedTouches[0];
  if (!touch) return;
  touchEndX.value = touch.screenX;
}

const handleTouchEnd = () => {
  const swipeDistance = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50

  if (swipeDistance > minSwipeDistance) {
    // Swipe left - show delete action
    isSwipedLeft.value = true
    setTimeout(() => {
      isSwipedLeft.value = false
    }, 2000)
  } else if (swipeDistance < -minSwipeDistance) {
    // Swipe right - hide delete action
    isSwipedLeft.value = false
  }
}

const gridClass = computed(() => {
  const teamCount = props.round.length
  if (teamCount === 2) return 'grid-cols-2'
  if (teamCount === 3) return 'grid-cols-3'
  return 'grid-cols-1'
})

const getScoreClass = (score: number) => {
  if (score > 0) return 'text-green-600'
  if (score < 0) return 'text-red-600'
  return 'text-gray-500'
}
</script>
