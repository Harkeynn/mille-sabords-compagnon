export type Symbol = 'skull' | 'sword' | 'parrot' | 'monkey' | 'diamond' | 'coin'

export type Card =
  | 'chest'
  | 'captain'
  | 'skull1'
  | 'skull2'
  | 'guardian'
  | 'ship2'
  | 'ship3'
  | 'ship4'
  | 'coin'
  | 'diamond'
  | 'animals'

export interface Player {
  id: string
  name: string
  score: number
  bestRound: number
  skullIslandTotal: number
  nbBoatsLoose: number
  nbBoatsWin: number
  nbCaptain: number
  nbCoins: number
  nbDiamonds: number
  nbPet: number
  nbVault: number
  nbWarden: number
}

export interface HistoryItem {
  id: string
  playerId: string
  score: number
}
