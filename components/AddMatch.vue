<template>
    <div v-if="!store.teams">
        <v-btn color="primary">Marcar Pontos</v-btn>
        <v-dialog v-model="dialog" activator="parent" width="auto">
            <v-card>
                <v-card-text>
                    <v-text-field type="number" v-for="(name, index) in store.names" :label="name" :rules="[rules.scores]"
                        v-model.number="score[index]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="add">Adicionar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { useCanastraStore } from '@/stores/canastra'
export default ({
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
                scores: value => !!value || 'Obrigatório',
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
        }
    }
})
</script>