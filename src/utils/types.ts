export type Symbol = 'skull' | 'sword' | 'parrot' | 'monkey' | 'diamond' | 'coin';

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
  | 'animals';

export interface Player {
  id: string;
  name: string;
  score: number;
  bestRound: number;
  skullIslandTotal: number;
  treasuresTotal: number;
  petsTotal: number;
  nbRoundsLost: number;
  nbShipsLoose: number;
  nbShipsWin: number;
  nbCaptains: number;
  nbChests: number;
  nbGuardians: number;
}

export interface Roll {
  points: number;
  skullIslandTotal: number;
  treasuresTotal: number;
  petsTotal: number;
  nbRoundsLost: number;
  nbShipsLoose: number;
  nbShipsWin: number;
  nbCaptains: number;
  nbChests: number;
  nbGuardians: number;
}

export interface HistoryItem extends Roll {
  id: string;
  playerId: string;
}
