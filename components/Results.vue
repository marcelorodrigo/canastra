<template>
    <div></div>
    <!-- <v-table>
        <thead>
            <tr>
                <th v-for="(name, i) in store.names">
                    {{ store.totals[i] }}
                </th>
            </tr>
        </thead>
    </v-table> -->
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