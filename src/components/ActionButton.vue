<template>
  <div class="flex items-center space-x-3 animate-fade-in">
    <!-- Action button -->
    <button
      @click="$emit('click')"
      class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-lg touch-manipulation transform transition-all duration-300 hover:scale-110 active:scale-95"
      :class="buttonClass"
    >
      {{ icon }}
    </button>

    <!-- Label -->
    <div class="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  label: string
  color?: 'green' | 'red' | 'blue' | 'orange'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'green'
})

defineEmits<{
  click: []
}>()

const buttonClass = computed(() => {
  const baseClass = 'hover:shadow-xl'
  switch (props.color) {
    case 'red':
      return `${baseClass} bg-red-500 hover:bg-red-600`
    case 'blue':
      return `${baseClass} bg-blue-500 hover:bg-blue-600`
    case 'orange':
      return `${baseClass} gradient-accent`
    default:
      return `${baseClass} gradient-primary`
  }
})
</script>
