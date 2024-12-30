<template>
  <div class="p-4">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src="@/assets/cards.webp"
        alt="Cards"
        class="w-full h-24 object-cover"
      />
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Novo Jogo</h2>
        <div class="mb-4">Quantas equipes estão jogando?</div>
        <div class="flex space-x-2 mb-4">
          <button
            v-for="value in [2, 3]"
            :key="value"
            :class="{
              'bg-blue-500 text-white': teams === value,
              'bg-gray-200': teams !== value,
            }"
            class="px-4 py-2 rounded"
            @click="teams = value"
          >
            {{ value }} equipes
          </button>
        </div>
        <div v-for="i in teams" :key="i" class="mb-4">
          <label
            :for="`team-${i}`"
            class="block text-sm font-medium text-gray-700"
            >Time {{ i }}</label
          >
          <input
            type="text"
            v-model="names[i - 1]"
            :id="`team-${i}`"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': !names[i - 1] }"
          />
        </div>
        <div class="mb-4">
          <label
            for="winningPoints"
            class="block text-sm font-medium text-gray-700"
            >Pontos para vencer</label
          >
          <input
            type="number"
            v-model.number="winningPoints"
            id="winningPoints"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          @click="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Iniciar Jogo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCanastraStore } from "@/stores/canastra.ts";

const teams = ref<number>(2);
const names = ref<string[]>(["Nós", "Eles", "Amigues"]);
const winningPoints = ref<number>(3000);
const scores = useCanastraStore();

const submit = (): void => {
  if (
    names.value.slice(0, teams.value).every((name) => !!name) &&
    winningPoints.value > 0
  ) {
    if (teams.value === 2) {
      names.value = names.value.slice(0, 2);
    }
    scores.teams = teams.value;
    scores.names = names.value;
    scores.winningPoints = winningPoints.value;
  }
};
</script>
