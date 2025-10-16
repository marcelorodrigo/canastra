<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-4 safe-bottom">
    <!-- Progress indicator -->
    <div class="mb-8 pt-4">
      <div class="flex justify-center space-x-2">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="step <= currentStep ? 'bg-primary-500' : 'bg-gray-300'"
        ></div>
      </div>
      <div class="text-center mt-2 text-sm text-gray-600">
        Passo {{ currentStep }} de {{ totalSteps }}
      </div>
    </div>

    <!-- Step content with transitions -->
    <div class="relative overflow-hidden">
      <Transition
        :name="slideDirection"
        mode="out-in"
      >
        <div :key="currentStep">
          <!-- Step 1: Team count selection -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Novo Jogo</h2>
              <p class="text-gray-600">Quantas equipes estão jogando?</p>
            </div>

            <div class="space-y-3">
              <button
                v-for="option in teamOptions"
                :key="option.value"
                @click="selectTeamCount(option.value)"
                class="w-full p-6 rounded-2xl border-2 transition-all duration-200 touch-manipulation"
                :class="selectedTeams === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'"
              >
                <div class="flex items-center justify-between">
                  <div class="text-left">
                    <div class="font-semibold">{{ option.label }}</div>
                    <div class="text-sm text-gray-500">{{ option.description }}</div>
                  </div>
                  <div class="text-2xl">{{ option.icon }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Step 2: Team names -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Nomes das Equipes</h2>
              <p class="text-gray-600">Como vocês querem ser chamados?</p>
            </div>

            <div class="space-y-4">
              <div
                v-for="i in selectedTeams"
                :key="i"
                class="relative"
              >
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Equipe {{ i }}
                </label>
                <input
                  v-model="teamNames[i - 1]"
                  type="text"
                  :placeholder="`Nome da equipe ${i}`"
                  class="w-full px-4 py-4 text-lg rounded-xl border-2 transition-colors duration-200 touch-manipulation"
                  :class="getInputClass(i - 1)"
                  @focus="focusedInput = i - 1"
                  @blur="focusedInput = -1"
                />
                <div
                  v-if="!isValidTeamName(i - 1) && attemptedNext"
                  class="mt-1 text-sm text-red-600 animate-fade-in"
                >
                  Nome obrigatório
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Winning points -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Meta de Pontos</h2>
              <p class="text-gray-600">Quantos pontos para vencer?</p>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="preset in pointPresets"
                  :key="preset"
                  @click="winningPoints = preset"
                  class="p-4 rounded-xl border-2 text-center transition-all duration-200 touch-manipulation"
                  :class="winningPoints === preset
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'"
                >
                  <div class="text-xl font-bold">{{ preset }}</div>
                  <div class="text-xs text-gray-500">pontos</div>
                </button>
              </div>

              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ou defina um valor personalizado:
                </label>
                <input
                  v-model.number="winningPoints"
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  class="w-full px-4 py-4 text-lg text-center rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-0 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Navigation buttons -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm safe-bottom">
      <div class="flex justify-between space-x-4">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold touch-manipulation"
        >
          Voltar
        </button>
        <button
          @click="nextStep"
          :disabled="!canProceed"
          class="flex-1 py-4 px-6 rounded-xl font-semibold text-white touch-manipulation transition-all duration-200"
          :class="canProceed
            ? 'gradient-primary hover:shadow-lg transform hover:scale-105'
            : 'bg-gray-300 cursor-not-allowed'"
        >
          {{ currentStep === totalSteps ? 'Iniciar Jogo' : 'Próximo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCanastraStore } from '@/stores/canastra'

const store = useCanastraStore()

// Wizard state
const currentStep = ref(1)
const totalSteps = 3
const slideDirection = ref('slide-next')
const attemptedNext = ref(false)
const focusedInput = ref(-1)

// Form data
const selectedTeams = ref(2)
const teamNames = ref(['Nós', 'Eles', 'Amigues'])
const winningPoints = ref(3000)

// Step 1 options
const teamOptions = [
  {
    value: 2,
    label: '2 Equipes',
    description: 'Clássico jogo em duplas',
    icon: '👥'
  },
  {
    value: 3,
    label: '3 Equipes',
    description: 'Mais desafio e estratégia',
    icon: '👨‍👩‍👧'
  }
]

// Step 3 presets
const pointPresets = [1500, 3000, 5000, 7500]

// Computed properties
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedTeams.value > 0
    case 2:
      return teamNames.value.slice(0, selectedTeams.value).every(name => name.trim())
    case 3:
      return winningPoints.value >= 100
    default:
      return false
  }
})

// Methods
const selectTeamCount = (count: number) => {
  selectedTeams.value = count
  setTimeout(() => {
    nextStep()
  }, 300)
}

const nextStep = () => {
  if (!canProceed.value) {
    attemptedNext.value = true
    return
  }

  if (currentStep.value === totalSteps) {
    // Start game
    store.teams = selectedTeams.value
    store.names = teamNames.value.slice(0, selectedTeams.value)
    store.winningPoints = winningPoints.value
    return
  }

  slideDirection.value = 'slide-next'
  currentStep.value++
  attemptedNext.value = false
}

const previousStep = () => {
  slideDirection.value = 'slide-prev'
  currentStep.value--
  attemptedNext.value = false
}

const isValidTeamName = (index: number) => {
  return teamNames.value[index] && teamNames.value[index].trim()
}

const getInputClass = (index: number) => {
  const isValid = isValidTeamName(index)
  const isFocused = focusedInput.value === index
  const hasError = !isValid && attemptedNext.value

  if (hasError) return 'border-red-500 focus:border-red-500'
  if (isFocused) return 'border-primary-500'
  return 'border-gray-200 focus:border-primary-500'
}
</script>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-next-enter-from {
  transform: translateX(100%);
}
.slide-next-leave-to {
  transform: translateX(-100%);
}

.slide-prev-enter-from {
  transform: translateX(-100%);
}
.slide-prev-leave-to {
  transform: translateX(100%);
}
</style>
