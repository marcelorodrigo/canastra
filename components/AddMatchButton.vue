<template>
    <div>
        <v-bottom-navigation>
            <v-btn color="primary" text="Marcar Pontos" @click="dialog = true" />
            <v-btn color="danger" text="Novo Jogo" @click="newGame" />
        </v-bottom-navigation>
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
import { useCanastraStore } from '@/stores/canastra'
export default {
    setup() {
        return {
            store: useCanastraStore(),
        }
    },
    data() {
        return {
            dialog: false,
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
            this.store.reset();
        }
    }
}
</script>