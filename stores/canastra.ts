import { match } from 'assert'
import { defineStore } from 'pinia'

// scores is the name of the store. It is unique across your application
// and will appear in devtools
export const useCanastraStore = defineStore('scores', {
    // a function that returns a fresh state
    state: () => ({
        teams: 2,
        names: ['Nós', 'Eles'],
        rounds: [[10,20],[-10,-20]]
    }),
    // optional getters
    getters: {
        // getters receive the state as first parameter
        doubleCounter: (state) => state.teams * 2,
        // use getters in other getters
        doubleCounterPlusOne(): number {
            return this.doubleCounter + 1
        },
    },
    // optional actions
    actions: {
        reset() {
            // `this` is the store instance
            this.teams = 2
            this.names = ['Nós', 'Eles']
            this.rounds = []
        },
    },
})
