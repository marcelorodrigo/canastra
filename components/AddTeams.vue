<template>
    <div v-if="!store.teams">
        <div>Quantos times estão jogando?</div>
        <v-btn text="2" :active="teams == 2" @click="teams = 2"></v-btn>
        <v-btn text="3" :active="teams == 3" @click="teams = 3"></v-btn>
        <div><br /></div>
        <v-text-field v-for="i in teams" type="text" v-model="names[i - 1]" label="Nome do Time"></v-text-field>
        <div><br /></div>
        <v-text-field type="number" v-model.number="vencedor" label="Qual a pontuação para definir o time vencedor?"
            :rules="[rules.vencedor]"></v-text-field>
        <br />
        <br />
        <v-btn text="Começar" @click="start" />
    </div>
</template>
<script lang="ts">
import { useCanastraStore } from '@/stores/canastra'
export default ({
    setup() {
        return {
            store: useCanastraStore(),
        }
    },
    data() {
        return {
            teams: 2,
            names: ['Nós','Eles'],
            vencedor: 3000,
            rules: {
                vencedor: (value: number) => (!!value && value > 0) || 'Obrigatório',
            },
        }
    },
    methods: {
        start() {
            this.store.names = this.names;
            this.store.vencedor = this.vencedor;
            this.store.teams = this.teams;
            this.store.totals = [0, 0];
            if (this.store.teams == 3) {
                this.store.totals[2] = 0;
            }

        }
    }
})
</script>