<template>
    <div>
        <v-card>
            <v-img src="cards.jpg" height="100px" cover></v-img>
            <v-card-title>Novo Jogo</v-card-title>
            <v-card-text>
                <div>Quantos times estão jogando?</div>
                <v-chip-group v-model.number="teams">
                    <v-chip value="2">2 times</v-chip>
                    <v-chip value="3">3 times</v-chip>
                </v-chip-group>
                <v-text-field v-for="i in teams" type="text" v-model="names[i - 1]" :label="`Time ${i}`"
                    :rules="[rules.required]" class="py-4"></v-text-field>
                <v-text-field type="number" v-model.number="winningPoints"
                    label="Qual a pontuação para definir o time vencedor?"
                    :rules="[rules.required, rules.numeric, rules.minPoints, rules.maxPoints]"></v-text-field>
            </v-card-text>
        </v-card>
        <v-bottom-navigation>
            <v-btn text="Começar" @click="start" />
        </v-bottom-navigation>
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
            teams: 2,
            names: ['Nós', 'Eles'],
            winningPoints: 3000,
            rules: {
                required: (value: any) => !!value || 'Required.',
                numeric: (value: any) => /^\d+$/.test(value) || 'Numeric only.',
                minPoints: (value: any) => value >= 1 || 'Minimum 1 point.',
                maxPoints: (value: any) => value <= 99999 || 'Maximum 99999 points.',
            },
        }
    },
    methods: {
        start() {
            this.store.names = this.names;
            this.store.winningPoints = this.winningPoints;
            this.store.teams = this.teams;
        }
    }
}
</script>