<template>
  <div>
    <v-bottom-navigation>
      <v-btn color="primary" text="Marcar Pontos" @click="dialog = true"/>
      <v-btn color="danger" text="Novo Jogo" @click="apagarDialog = true"/>
    </v-bottom-navigation>
    <v-dialog transition="dialog-bottom-transition" width="auto" v-model="apagarDialog">
      <v-card>
        <v-toolbar title="Apagar tudo"></v-toolbar>
        <v-card-text class="pa-12">
          Ao confirmar a pontuação será totalmente removida para iniciar um novo jogo.<br />
          Deseja continuar?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn
              text="Apagar tudo"
              color="primary"
              @click="newGame"
          ></v-btn>
          <v-btn
              text="Fechar"
              color="secondary"
              @click="apagarDialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" width="auto" min-width="320">
      <v-card>
        <v-card-title>Marcar pontos</v-card-title>
        <v-card-text>
          <v-text-field type="number" v-for="(name, index) in store.names" :label="name" :rules="[rules.scores]"
                        v-model.number="score[index]" class="py-3"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="add">Adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import {useCanastraStore} from '@/stores/canastra'

export default {
  setup() {
    return {
      store: useCanastraStore(),
    }
  },
  data() {
    return {
      dialog: false,
      apagarDialog: false,
      score: [],
      rules: {
        scores: (value: any) => !!value || 'Obrigatório',
      },
    }
  },
  methods: {
    add() {
      this.store.addScore(this.score)
      this.score = []
      this.closeDialog()
    },
    closeDialog() {
      this.dialog = false
    },
    newGame() {
      this.store.reset()
      this.apagarDialog = false
    }
  }
}
</script>