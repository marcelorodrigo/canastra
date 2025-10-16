<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <!-- Illustration -->
    <div class="w-24 h-24 mb-6 text-gray-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    </div>

    <!-- Message -->
    <h3 class="text-lg font-semibold text-gray-900 mb-2 text-center">
      Nenhuma rodada ainda
    </h3>
    <p class="text-gray-600 text-center max-w-sm mb-6">
      Comece marcando os pontos da primeira rodada. O histórico aparecerá aqui conforme você joga.
    </p>

    <!-- Call to action -->
    <div class="flex items-center space-x-2 text-primary-600">
      <span class="text-sm font-medium">Toque no botão</span>
      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
        <span class="text-lg">+</span>
      </div>
      <span class="text-sm font-medium">para começar</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Empty state component - no props or logic needed
</script>
