<template>
    <div class="d-flex flex-row">
        <div v-for="(name, i) in store.names" class="text-h5">
            {{ name }}
            <span class="">{{ store.totals[i] }}</span>
        </div>
    </div>
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