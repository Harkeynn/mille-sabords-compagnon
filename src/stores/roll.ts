import { getComboScore } from '@/utils/helpers'
import type { Card, Symbol } from '@/utils/types'
import { defineStore } from 'pinia'

export default defineStore('roll', {
  state: () => ({
    isSkullIsland: false,
    symbols: {
      skull: 0,
      sword: 0,
      parrot: 0,
      monkey: 0,
      diamond: 0,
      coin: 0
    } as Record<Symbol, number>,
    currentCard: null as Card | null
  }),
  getters: {
    points: ({ currentCard, isSkullIsland, symbols }) => {
      const computedSymbols = { ...symbols, animals: 0 }
      let valuedDices = 0
      let result = 0
      switch (currentCard) {
        case 'skull1':
          computedSymbols.skull += 1
          break
        case 'skull2':
          computedSymbols.skull += 2
          break
        case 'animals':
          computedSymbols.monkey = 0
          computedSymbols.parrot = 0
          computedSymbols.animals = symbols.monkey + symbols.parrot
          break
        case 'ship2':
          if (computedSymbols.sword < 2) {
            return -300
          }
          if (computedSymbols.sword === 2) {
            valuedDices += 2
          }
          result += 300
          break
        case 'ship3':
          if (computedSymbols.sword < 3) {
            return -500
          }
          result += 500
          break
        case 'ship4':
          if (computedSymbols.sword < 4) {
            return -1000
          }
          result += 1000
          break
        case 'coin':
          computedSymbols.coin += 1
          valuedDices -= 1
          break
        case 'diamond':
          computedSymbols.diamond += 1
          valuedDices -= 1
          break
      }
      if (!isSkullIsland && computedSymbols.skull > 2) {
        return 0
      }

      const multiplier = currentCard === 'captain' ? 2 : 1

      if (isSkullIsland) {
        return computedSymbols.skull * -100 * multiplier
      }
      result += (Object.keys(computedSymbols) as (Symbol | 'animals')[]).reduce(
        (totalValue, key) => {
          const comboScore = getComboScore(computedSymbols[key], ['coin', 'diamond'].includes(key))
          if (comboScore > 0) {
            valuedDices += computedSymbols[key]
          }
          totalValue += comboScore
          return totalValue
        },
        0
      )
      if (valuedDices === 8) {
        result += 500
      }
      return result * multiplier
    }
  }
})
