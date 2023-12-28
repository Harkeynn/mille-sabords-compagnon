import type { Player, Roll } from '@/utils/types';
import { defineStore } from 'pinia';

export default defineStore('players', {
  state: () => ({
    players: [] as Player[],
    currentPlayerId: null as string | null,
  }),
  getters: {
    winners(state): Player[] {
      const bestScore = state.players.map(({ score }) => score).sort((a, b) => b - a)[0];
      return state.players.filter(({ score }) => score === bestScore);
    },
  },
  actions: {
    updatePlayerStats(playerId: string, roll: Roll) {
      const playerIndex = this.players.findIndex(({ id }) => id === playerId);

      if (playerIndex > -1) {
        this.players[playerIndex] = Object.keys(this.players[playerIndex]).reduce((result, key) => {
          if (key !== 'id' && Object.prototype.hasOwnProperty.call(roll, key)) {
            (result[key as keyof Player] as number) += roll[key as keyof Roll];
          }
          return result;
        }, this.players[playerIndex] as Player);

        if (this.players[playerIndex].bestRound < roll.points) {
          this.players[playerIndex].bestRound = roll.points;
        }

        if (!roll.skullIslandTotal) {
          this.players[playerIndex].score += roll.points;
        }
        if (this.players[playerIndex].score < 0) {
          this.players[playerIndex].score = 0;
        }
      }
    },
  },
});
