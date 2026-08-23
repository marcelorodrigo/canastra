<template>
  <div>
    <!-- FAB and expanded menu -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Backdrop when expanded -->
      <Transition name="backdrop">
        <div
          v-if="isExpanded"
          class="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          @click="closeMenu"
        ></div>
      </Transition>

      <!-- Action buttons (appear above FAB when expanded) -->
      <Transition name="fab-actions">
        <div
          v-if="isExpanded"
          :id="menuId"
          class="absolute bottom-16 right-0 w-[50vw] min-w-[200px] max-w-md space-y-3"
        >
          <ActionButton icon="➕" label="Adicionar Pontos" color="amber" @click="openScoreSheet" />
          <ActionButton icon="🔄" label="Revanche" color="blue" @click="openRevancheModal" />
          <ActionButton icon="🗑️" label="Apagar Tudo" color="red" @click="openDeleteModal" />
        </div>
      </Transition>

      <!-- Main FAB -->
      <button
        @click="toggleMenu"
        :aria-label="isExpanded ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="isExpanded"
        :aria-controls="menuId"
        class="w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center text-white text-xl touch-manipulation transform transition-all duration-300 hover:scale-110 active:scale-95"
        :class="{ 'rotate-45': isExpanded }"
      >
        {{ isExpanded ? '✕' : '+' }}
      </button>
    </div>

    <!-- Score input bottom sheet -->
    <BottomSheet
      v-if="showScoreSheet"
      :show="showScoreSheet"
      @close="closeScoreSheet"
      title="Adicionar Pontos"
    >
      <ScoreInputForm @submit="addScore" @cancel="closeScoreSheet" />
    </BottomSheet>

    <!-- Confirmation modals -->
    <ConfirmModal
      v-if="showRevancheModal"
      :show="showRevancheModal"
      title="Nova Revanche?"
      message="A pontuação será zerada e uma nova partida começará com os mesmos times."
      confirmText="Começar Revanche"
      icon="🔄"
      @confirm="startRevanche"
      @cancel="closeRevancheModal"
    />

    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="Apagar Tudo?"
      message="Toda a pontuação será perdida e você retornará à tela inicial."
      confirmText="Apagar Tudo"
      confirmColor="red"
      icon="🗑️"
      @confirm="resetGame"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'
import { useCanastraStore } from '@/stores/canastra'
import BottomSheet from './BottomSheet.vue'
import ConfirmModal from './ConfirmModal.vue'
import ActionButton from './ActionButton.vue'
import ScoreInputForm from './ScoreInputForm.vue'

const store = useCanastraStore()

// FAB state
const isExpanded = ref(false)
const showScoreSheet = ref(false)
const showRevancheModal = ref(false)
const showDeleteModal = ref(false)
const menuId = useId()

// Methods
const toggleMenu = () => {
  if (isExpanded.value) {
    closeMenu()
  } else {
    isExpanded.value = true
  }
}

const closeMenu = () => {
  isExpanded.value = false
}

const openScoreSheet = () => {
  showScoreSheet.value = true
  closeMenu()
}

const closeScoreSheet = () => {
  showScoreSheet.value = false
}

const openRevancheModal = () => {
  showRevancheModal.value = true
  closeMenu()
}

const closeRevancheModal = () => {
  showRevancheModal.value = false
}

const openDeleteModal = () => {
  showDeleteModal.value = true
  closeMenu()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const addScore = (scores: number[]) => {
  store.addRound(scores)
  closeScoreSheet()
}

const startRevanche = () => {
  store.revanche()
  closeRevancheModal()
}

const resetGame = () => {
  store.reset()
  closeDeleteModal()
}
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

.fab-actions-enter-active,
.fab-actions-leave-active {
  transition: all 0.3s ease;
}

.fab-actions-enter-from,
.fab-actions-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>
