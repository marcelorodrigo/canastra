<template>
  <div>
    <div class="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-800 p-4">
      <button class="bg-blue-500 text-white py-2 px-4 rounded" @click="dialog = true">Marcar Pontos</button>
      <button class="bg-green-500 text-white py-2 px-4 rounded" @click="revancheDialog = true">Revanche</button>
      <button class="bg-red-500 text-white py-2 px-4 rounded" @click="apagarDialog = true">Apagar tudo</button>
    </div>

    <div v-if="apagarDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-auto">
        <div class="text-lg font-bold mb-4">Apagar tudo</div>
        <div class="mb-4">
          Ao confirmar a pontuação será totalmente removida para iniciar um novo jogo.<br />
          Deseja continuar?
        </div>
        <div class="flex justify-end">
          <button class="bg-blue-500 text-white py-2 px-4 rounded" @click="newGame">Apagar tudo</button>
        </div>
      </div>
    </div>

    <div v-if="dialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-auto">
        <div class="text-lg font-bold mb-4">Adicionar Pontos</div>
        <div class="flex justify-end">
          <button class="bg-blue-500 text-white py-2 px-4 rounded" @click="add">Adicionar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCanastraStore } from "@/stores/canastra";

const store = useCanastraStore();

const dialog = ref(false);
const apagarDialog = ref(false);
const revancheDialog = ref(false);
const score = ref<number[]>([]);
const rules = {
  scores: (value: any) => !!value || "Obrigatório",
};

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

<style scoped>
/* Add your styles here */
</style>