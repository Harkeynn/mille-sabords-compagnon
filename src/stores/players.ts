import type { Player } from '@/utils/types'
import { defineStore } from 'pinia'

export default defineStore('players', {
  state: () => ({
    players: [] as Player[],
    currentPlayerId: null as string | null
  }),
  getters: {
    winners(state) {
      const bestScore = state.players.map(({ score }) => score).sort((a, b) => b - a)[0]
      console.log({ players: state.players, bestScore })
      return state.players.filter(({ score }) => score === bestScore)
    }
  }
})
