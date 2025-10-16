<template>
  <button
    @click="$emit('click')"
    class="w-full min-w-[200px] h-14 px-4 rounded-xl shadow-lg flex items-center justify-start space-x-3 text-white touch-manipulation transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
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
      return `${baseClass} bg-red-400 hover:bg-red-500`
    case 'blue':
      return `${baseClass} bg-blue-400 hover:bg-blue-500`
    case 'green':
      return `${baseClass} bg-green-400 hover:bg-green-500`
    case 'orange':
      return `${baseClass} bg-orange-400 hover:bg-orange-500`
    default:
      return `${baseClass} gradient-primary`
  }
})
</script>
