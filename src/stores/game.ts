import type { HistoryItem } from '@/utils/types'
import { defineStore } from 'pinia'

export default defineStore('game', {
  state: () => ({
    gameStarted: false,
    history: [] as HistoryItem[],
    reversedActions: [] as HistoryItem[]
  })
})
