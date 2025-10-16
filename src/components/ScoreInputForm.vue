<template>
  <div class="space-y-6">
    <!-- Team score inputs -->
    <div class="space-y-4">
      <div
        v-for="(_, index) in store.teams"
        :key="index"
        class="relative"
      >
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ store.names[index] }}
        </label>
        <div class="relative">
          <input
            v-model.number="scores[index]"
            type="number"
            placeholder="0"
            class="w-full px-4 py-4 text-lg text-center rounded-xl border-2 transition-colors duration-200 touch-manipulation"
            :class="getInputClass(index)"
            @focus="focusedInput = index"
            @blur="focusedInput = -1"
            step="50"
          />

          <!-- Quick increment buttons -->
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
            <button
              @click="incrementScore(index, 50)"
              class="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold touch-manipulation hover:bg-green-200 transition-colors"
            >
              +
            </button>
            <button
              @click="incrementScore(index, -50)"
              class="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold touch-manipulation hover:bg-red-200 transition-colors"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick score presets -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-3">
        Pontuações Rápidas
      </label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="preset in scorePresets"
          :key="preset"
          @click="addPresetToFocused(preset)"
          class="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium touch-manipulation hover:bg-gray-200 transition-colors"
          :disabled="focusedInput === -1"
          :class="{ 'opacity-50 cursor-not-allowed': focusedInput === -1 }"
        >
          {{ preset > 0 ? '+' : '' }}{{ preset }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Toque em um campo acima e depois em uma pontuação rápida
      </p>
    </div>

    <!-- Total display -->
    <div class="bg-gray-50 rounded-xl p-4">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-700">Total da rodada:</span>
        <span class="text-lg font-bold" :class="totalClass">
          {{ totalScore > 0 ? '+' : '' }}{{ totalScore }}
        </span>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="space-y-3">
      <button
        @click="submitScore"
        :disabled="!canSubmit"
        class="w-full py-4 px-6 rounded-xl font-semibold text-white touch-manipulation transition-all duration-200"
        :class="canSubmit
          ? 'gradient-primary hover:shadow-lg transform hover:scale-105'
          : 'bg-gray-300 cursor-not-allowed'"
      >
        Adicionar Pontos
      </button>
      <button
        @click="$emit('cancel')"
        class="w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold touch-manipulation hover:bg-gray-200 transition-colors"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCanastraStore } from '@/stores/canastra'

const store = useCanastraStore()

const emit = defineEmits<{
  submit: [scores: number[]]
  cancel: []
}>()

// Form state
const scores = ref<number[]>(new Array(store.teams).fill(0))
const focusedInput = ref(-1)

// Score presets for quick input
const scorePresets = [50, 100, 150, 200, -50, -100, -150, -200]

// Computed properties
const totalScore = computed(() => {
  return scores.value.reduce((sum, score) => sum + (score || 0), 0)
})

const canSubmit = computed(() => {
  return scores.value.some(score => score !== 0)
})

const totalClass = computed(() => {
  if (totalScore.value > 0) return 'text-green-600'
  if (totalScore.value < 0) return 'text-red-600'
  return 'text-gray-500'
})

// Methods
const getInputClass = (index: number) => {
  const isFocused = focusedInput.value === index
  const score = scores.value[index] || 0

  if (isFocused) return 'border-primary-500'
  if (score > 0) return 'border-green-300 bg-green-50'
  if (score < 0) return 'border-red-300 bg-red-50'
  return 'border-gray-200'
}

const incrementScore = (index: number, amount: number) => {
  scores.value[index] = (scores.value[index] || 0) + amount
}

const addPresetToFocused = (preset: number) => {
  if (focusedInput.value >= 0) {
    scores.value[focusedInput.value] = (scores.value[focusedInput.value] || 0) + preset
  }
}

const submitScore = () => {
  if (canSubmit.value) {
    emit('submit', [...scores.value])
    // Reset form
    scores.value = new Array(store.teams).fill(0)
  }
}
</script>
