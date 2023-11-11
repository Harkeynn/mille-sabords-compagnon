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

export interface Player extends Stats {
  id: string;
  name: string;
  score: number;
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

export interface StatItem {
  points: number;
  playerName: string;
}

export interface Stats {
  bestRound?: number;
  nbCaptains?: number;
  nbChests?: number;
  nbGuardians?: number;
  nbRoundsLost?: number;
  nbShipsLoose?: number;
  nbShipsWin?: number;
  petsTotal?: number;
  skullIslandTotal?: number;
  treasuresTotal?: number;
}

export type BestStats = Record<keyof Stats, StatItem>;
