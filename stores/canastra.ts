import { defineStore } from 'pinia'

interface CanastraState {
    teams: number;
    names: string[];
    totals: number[];
    rounds: number[][];
    winningPoints: number;
  }

// scores is the name of the store. It is unique across your application
// and will appear in devtools
export const useCanastraStore = defineStore('scores', {
    // a function that returns a fresh state
    state: (): CanastraState => ({
        teams: 0,
        names: ['',''],
        totals: [0,0],
        rounds: [],
        winningPoints: 3000,
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
            this.teams = 0
            this.names = ['','']
            this.totals = [0,0]
            this.rounds = []
            this.winningPoints = 3000
        },
        addScore(scores: [number]) {
            if (scores.length !== this.teams) {
                console.error('Scores provided do not match teams playing')
            }
            this.rounds.push(scores)
            scores.map((score, i) => this.totals[i] += score)
        },
        removeScore(row: number) {
            this.rounds.splice(row, 1);
        }
    },
})
