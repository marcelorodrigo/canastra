<template>
    <v-table>
        <thead>
            <tr>
                <th v-for="(name, i) in store.names" class="text-h6">
                    {{ name }}: {{ store.totals[i] }}
                </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(round, i) in store.rounds">
                <td v-for="team in store.teams">{{ round[team - 1] }}</td>
                <td><v-btn density="compact" icon="mdi-delete" @click="remove(i)"></v-btn></td>
            </tr>
        </tbody>
    </v-table>
</template>
<script>
import { useCanastraStore } from '@/stores/canastra'
export default defineComponent({
    setup() {
        return {
            store: useCanastraStore(),
        }
    },
    methods: {
        remove(row) {
            this.store.removeScore(row);
        }
    }
})
</script>