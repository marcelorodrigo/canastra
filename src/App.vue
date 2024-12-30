<template>
  <Header></Header>
  <AddTeams v-show="!hasGameStarted"></AddTeams>
  <Matches v-show="hasGameStarted"></Matches>
  <AddMatchButton v-show="hasGameStarted"></AddMatchButton>
  <main></main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCanastraStore } from "./stores/canastra.ts";
import AddTeams from "./components/AddTeams.vue";
import AddMatchButton from "./components/AddMatchButton.vue";
import Header from "./components/Header.vue";
import Matches from "./components/Matches.vue";

const scores = useCanastraStore();

const hasGameStarted = computed(() => {
  return scores.teams > 0;
});
</script>
