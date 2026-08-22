<template>
  <AppHeader></AppHeader>
  <main>
    <AddTeams v-if="!hasGameStarted"></AddTeams>
    <template v-else>
      <ListMatches class="pt-1"></ListMatches>
      <AddMatchButton></AddMatchButton>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanastraStore } from './stores/canastra.ts'
import AddTeams from './components/AddTeams.vue'
import AddMatchButton from './components/AddMatchButton.vue'
import AppHeader from './components/AppHeader.vue'
import ListMatches from './components/ListMatches.vue'

const scores = useCanastraStore()

const hasGameStarted = computed(() => {
  return scores.hasActiveGame
})
</script>
