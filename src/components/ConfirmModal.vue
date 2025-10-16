<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-hidden">
      <!-- Backdrop -->
      <Transition name="backdrop">
        <div
          v-if="show"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          @click="$emit('cancel')"
        >
          <!-- Modal -->
          <Transition name="modal">
            <div
              v-if="show"
              class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
              @click.stop
            >
              <!-- Icon -->
              <div class="flex justify-center mb-4">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center"
                  :class="iconClass"
                >
                  <span class="text-xl">{{ icon }}</span>
                </div>
              </div>

              <!-- Title -->
              <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
                {{ title }}
              </h3>

              <!-- Message -->
              <p class="text-gray-600 text-center mb-6">
                {{ message }}
              </p>

              <!-- Actions -->
              <div class="space-y-3">
                <button
                  @click="$emit('confirm')"
                  class="w-full py-3 px-4 rounded-xl font-semibold text-white touch-manipulation transition-all duration-200"
                  :class="confirmButtonClass"
                >
                  {{ confirmText }}
                </button>
                <button
                  @click="$emit('cancel')"
                  class="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold touch-manipulation transition-colors duration-200 hover:bg-gray-200"
                >
                  {{ cancelText }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'

interface Props {
  show?: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'red' | 'green' | 'blue'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmColor: 'green',
  icon: '❓',
})

defineEmits<{
  confirm: []
  cancel: []
}>()

const iconClass = computed(() => {
  const baseClass = 'text-white'
  switch (props.confirmColor) {
    case 'red':
      return `${baseClass} bg-red-100 text-red-600`
    case 'blue':
      return `${baseClass} bg-blue-100 text-blue-600`
    default:
      return `${baseClass} bg-green-100 text-green-600`
  }
})

const confirmButtonClass = computed(() => {
  const baseClass = 'hover:shadow-lg transform hover:scale-105'
  switch (props.confirmColor) {
    case 'red':
      return `${baseClass} bg-red-500 hover:bg-red-600`
    case 'blue':
      return `${baseClass} bg-blue-500 hover:bg-blue-600`
    default:
      return `${baseClass} gradient-primary`
  }
})

let previousOverflow: string | null = null

const stop = watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow ?? ''
      previousOverflow = null
    }
  },
)

onUnmounted(() => {
  stop()
  document.body.style.overflow = previousOverflow ?? ''
  previousOverflow = null
})
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}
</style>
