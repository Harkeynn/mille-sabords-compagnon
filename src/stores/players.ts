import type { Player } from '@/utils/types'
import { defineStore } from 'pinia'

export default defineStore('players', {
  state: () => ({
    players: [] as Player[],
    currentPlayerId: null as string | null
  })
})
