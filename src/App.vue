<template>
  <Header></Header>
  <AddTeams v-show="!hasGameStarted"></AddTeams>
  <main></main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCanastraStore } from "./stores/canastra.ts";
import Header from "./components/Header.vue";
import AddTeams from "./components/AddTeams.vue";

const scores = useCanastraStore();

const hasGameStarted = computed(() => {
  return scores.teams > 0;
});
</script>
