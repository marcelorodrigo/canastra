<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th
          v-for="team in store.teams"
          :key="team"
          class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          {{ store.names[team - 1] }} [ {{ store.totals[team - 1] }} ]
        </th>
        <th
          class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          Ações
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(round, i) in store.rounds" :key="i">
        <td v-for="team in store.teams" :key="team" class="px-6 py-4 whitespace-nowrap">
          {{ round[team - 1] }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="text-red-600 hover:text-red-900" @click="remove(i)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v9a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm3 3a1 1 0 112 0v1a1 1 0 11-2 0V5zM5 8a1 1 0 011-1h8a1 1 0 011 1v7a1 1 0 11-2 0V9H7v6a1 1 0 11-2 0V8z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useCanastraStore } from '@/stores/canastra.ts'
const store = useCanastraStore()

const remove = (row: number) => {
  store.removeScore(row)
}
</script>
