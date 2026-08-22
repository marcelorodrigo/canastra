<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-hidden">
      <!-- Backdrop -->
      <Transition name="backdrop">
        <div
          v-if="show"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>
      </Transition>

      <!-- Bottom sheet -->
      <Transition name="slide-up">
        <div
          v-if="show"
          ref="dialogRef"
          v-bind="dialogAttrs"
          tabindex="-1"
          class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden safe-bottom"
        >
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 :id="titleId" class="text-xl font-semibold text-gray-900">{{ title }}</h2>
              <button
                @click="$emit('close')"
                aria-label="Fechar"
                class="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 overflow-y-auto">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useAccessibleOverlay } from '@/composables/useAccessibleOverlay'

interface Props {
  show?: boolean
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
})

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)

const { dialogAttrs, titleId } = useAccessibleOverlay(dialogRef, {
  isOpen: toRef(props, 'show'),
  onClose: () => emit('close'),
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
