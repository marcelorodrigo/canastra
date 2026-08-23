<template>
  <button
    @click="$emit('click')"
    class="w-full min-w-[200px] h-14 px-4 rounded-xl shadow-lg flex items-center justify-start space-x-3 touch-manipulation transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
    :class="buttonClass"
  >
    <span class="text-2xl">{{ icon }}</span>
    <span class="text-base font-medium flex-1 text-left">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  label: string
  color?: 'amber' | 'red' | 'blue' | 'orange'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'amber',
})

defineEmits<{
  click: []
}>()

const buttonClass = computed(() => {
  const baseClass = 'hover:shadow-xl'
  switch (props.color) {
    case 'red':
      return `${baseClass} bg-red-400 hover:bg-red-500 text-white`
    case 'blue':
      return `${baseClass} bg-blue-400 hover:bg-blue-500 text-white`
    case 'amber':
      return `${baseClass} bg-primary-500 hover:bg-primary-600 text-primary-900`
    case 'orange':
      return `${baseClass} bg-orange-400 hover:bg-orange-500 text-white`
    default:
      return `${baseClass} gradient-primary text-primary-900`
  }
})
</script>
