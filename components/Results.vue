<template>
    <div class="d-flex flex-row">
        <div v-for="name in store.names" class="text-h5">{{ name }}</div>
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