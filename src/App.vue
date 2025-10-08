<template>
  <AppHeader></AppHeader>
  <AddTeams v-show="!hasGameStarted"></AddTeams>
  <ListMatches v-show="hasGameStarted"></ListMatches>
  <AddMatchButton v-show="hasGameStarted"></AddMatchButton>
  <main></main>
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
  return scores.teams > 0
})
</script>
