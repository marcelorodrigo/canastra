<template>
    <v-btn color="primary">Marcar Pontos</v-btn>
    <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-card>
            <v-card-text>
                <v-text-field type="number" v-for="name in store.names" :label="name" :rules="[rules.scores]"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="dialog = false">Adicionar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
            rules: {
                scores: value => !!value || 'Obrigatório',
            },
        }
    },
})
</script>