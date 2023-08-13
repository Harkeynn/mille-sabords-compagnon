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
}
