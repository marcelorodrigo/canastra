<template>
    <table>
        <tr v-for="round in store.rounds">
            <td v-for="team in store.teams">{{  round[team-1] }}</td>
        </tr>
    </table>
</template>
<script>
import { useCanastraStore } from '@/stores/canastra'
export default defineComponent({
    setup() {
        return {
            store: useCanastraStore(),
        }
    }
})
</script>