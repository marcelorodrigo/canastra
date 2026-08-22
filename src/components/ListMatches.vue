<template>
  <div class="pb-24 px-8">
    <!-- Score summary cards -->
    <div class="grid grid-cols-2 gap-4 mb-6" v-if="store.teams === 2">
      <ScoreCard
        v-for="(view, index) in teamViews"
        :key="index"
        :teamName="view.name"
        :score="view.score"
        :isWinner="view.isWinner"
        :isLeading="view.isLeading"
        :isInObrigacao="view.isInObrigacao"
        :progressPercentage="view.progressPercentage"
      />
    </div>

    <!-- Multi-team layout for 3+ teams -->
    <div v-else class="space-y-3 mb-6">
      <ScoreCard
        v-for="(view, index) in teamViews"
        :key="index"
        :teamName="view.name"
        :score="view.score"
        :isWinner="view.isWinner"
        :isLeading="view.isLeading"
        :isInObrigacao="view.isInObrigacao"
        :progressPercentage="view.progressPercentage"
        layout="horizontal"
      />
    </div>

    <!-- Round history -->
    <div class="space-y-3">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Histórico de Rodadas</h3>
        <div class="text-sm text-gray-500">{{ store.rounds.length }} rodadas</div>
      </div>

      <TransitionGroup name="round" tag="div" class="space-y-3">
        <RoundCard
          v-for="(round, index) in reversedRounds"
          :key="`round-${reversedRounds.length - index - 1}`"
          :round="round"
          :roundNumber="reversedRounds.length - index"
          :teamNames="store.names"
          @delete="confirmDelete(reversedRounds.length - index - 1)"
        />
      </TransitionGroup>

      <EmptyState v-if="store.rounds.length === 0" />
    </div>

    <!-- Delete confirmation modal -->
    <ConfirmModal
      v-if="deleteIndex !== null"
      :show="deleteIndex !== null"
      title="Remover Rodada"
      :message="`Tem certeza que deseja remover a rodada ${deleteIndex + 1}?`"
      confirmText="Remover"
      cancelText="Cancelar"
      confirmColor="red"
      icon="🗑️"
      @confirm="deleteRound"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCanastraStore } from '@/stores/canastra'
import ScoreCard from './ScoreCard.vue'
import RoundCard from './RoundCard.vue'
import EmptyState from './EmptyState.vue'
import ConfirmModal from './ConfirmModal.vue'

const store = useCanastraStore()
const deleteIndex = ref<number | null>(null)

const teamViews = computed(() =>
  store.totals.map((score, index) => ({
    name: store.names[index] ?? '',
    score,
    isWinner: store.isWinner(index),
    isLeading: store.isLeading(index),
    isInObrigacao: store.isInObrigacao(index),
    progressPercentage: store.progressFor(index),
  })),
)

const confirmDelete = (index: number) => {
  deleteIndex.value = index
}

const deleteRound = () => {
  if (deleteIndex.value !== null) {
    store.removeRound(deleteIndex.value)
    deleteIndex.value = null
  }
}

const cancelDelete = () => {
  deleteIndex.value = null
}

const reversedRounds = computed(() => {
  return [...store.rounds].reverse()
})
</script>

<style scoped>
.round-enter-active,
.round-leave-active {
  transition: all 0.3s ease;
}

.round-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.round-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.round-move {
  transition: transform 0.3s ease;
}
</style>
