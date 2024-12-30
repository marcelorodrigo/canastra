import { defineStore } from "pinia";

interface CanastraState {
  teams: number;
  names: string[];
  rounds: number[][];
  winningPoints: number;
}

export const useCanastraStore = defineStore("scores", {
  persist: true,
  state: (): CanastraState => ({
    teams: 0,
    names: Array(2).fill(""),
    rounds: [],
    winningPoints: 3000,
  }),
  getters: {
    totals: (state) => {
      const totals: number[] = [];
      for (let i = 0; i < state.teams; i++) {
        totals[i] = state.rounds.reduce(
          (accumulator, round) => accumulator + (round[i] || 0),
          0,
        );
      }
      return totals;
    },
  },
  actions: {
    reset() {
      this.teams = 0;
      this.names = Array(2).fill("");
      this.rounds = [];
      this.winningPoints = 3000;
    },
    revanche() {
      this.rounds = [];
    },
    addScore(scores: number[]) {
      if (!scores || scores.length !== this.teams) {
        console.error("Scores provided do not match teams playing");
        return;
      }
      this.rounds.push(scores);
    },
    removeScore(row: number) {
      this.rounds.splice(row, 1);
    },
  },
});
