<template>
  <div>
    <div
      class="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-800 p-4"
    >
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded"
        @click="dialog = true"
      >
        Marcar Pontos
      </button>
      <button
        class="bg-green-500 text-white py-2 px-4 rounded"
        @click="revancheDialog = true"
      >
        Revanche
      </button>
      <button
        class="bg-red-500 text-white py-2 px-4 rounded"
        @click="apagarDialog = true"
      >
        Apagar tudo
      </button>
    </div>
    <div
      v-if="apagarDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-auto">
        <div class="text-lg font-bold mb-4">Apagar tudo</div>
        <div class="mb-4">
          Ao confirmar a pontuação será totalmente removida para iniciar um novo
          jogo.<br />
          Deseja continuar?
        </div>
        <div class="flex justify-end">
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded"
            @click="newGame"
          >
            Apagar tudo
          </button>
          <button
            class="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
            @click="apagarDialog = false"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="revancheDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-auto">
        <div class="text-lg font-bold mb-4">Revanche?</div>
        <div class="mb-4">
          Ao confirmar, a pontuação será apagada e uma revanche com mesmos times
          será iniciada.<br />
          Deseja continuar?
        </div>
        <div class="flex justify-end">
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded"
            @click="revanche"
          >
            Revanche
          </button>
          <button
            class="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
            @click="revancheDialog = false"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="dialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-auto">
        <div class="text-lg font-bold mb-4">Adicionar Pontos</div>
        <div v-for="(team, index) in store.teams" :key="index" class="mb-4">
          <label
            :for="'team-' + team"
            class="block text-sm font-medium text-gray-700"
            >{{ store.names[index] }}</label
          >
          <input
            :id="'team-' + team"
            type="number"
            v-model="score[index]"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex justify-end">
          <button class="bg-blue-500 text-white py-2 px-4 rounded" @click="add">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCanastraStore } from "@/stores/canastra";

const store = useCanastraStore();

const dialog = ref(false);
const apagarDialog = ref(false);
const revancheDialog = ref(false);
const score = ref<number[]>([]);

function add() {
  store.addScore(score.value);
  score.value = [];
  closeDialog();
}

function closeDialog() {
  dialog.value = false;
}

function newGame() {
  store.reset();
  apagarDialog.value = false;
}

function revanche() {
  store.revanche();
  revancheDialog.value = false;
}
</script>
