import { getComboScore } from '@/utils/helpers';
import type { Card, Roll, Symbol } from '@/utils/types';
import { defineStore } from 'pinia';

export default defineStore('roll', {
  state: () => ({
    isSkullIsland: false,
    symbols: {
      skull: 0,
      sword: 0,
      parrot: 0,
      monkey: 0,
      diamond: 0,
      coin: 0,
    } as Record<Symbol, number>,
    currentCard: null as Card | null,
  }),
  getters: {
    computedSymbols(): Record<Symbol | 'animals', number> {
      const result = { ...this.symbols, animals: 0 };
      switch (this.currentCard) {
        case 'skull1':
          result.skull += 1;
          break;
        case 'skull2':
          result.skull += 2;
          break;
        case 'animals':
          result.monkey = 0;
          result.parrot = 0;
          result.animals = this.symbols.monkey + this.symbols.parrot;
          break;
        case 'coin':
          result.coin += 1;
          break;
        case 'diamond':
          result.diamond += 1;
          break;
      }
      return result;
    },
    points(): number {
      let valuedDices = 0;
      let result = 0;
      switch (this.currentCard) {
        case 'ship2':
          if (this.computedSymbols.sword < 2) {
            return -300;
          }
          if (this.computedSymbols.sword === 2) {
            valuedDices += 2;
          }
          result += 300;
          break;
        case 'ship3':
          if (this.computedSymbols.sword < 3) {
            return -500;
          }
          result += 500;
          break;
        case 'ship4':
          if (this.computedSymbols.sword < 4) {
            return -1000;
          }
          result += 1000;
          break;
        case 'coin':
          valuedDices -= 1;
          break;
        case 'diamond':
          valuedDices -= 1;
          break;
      }
      if (!this.isSkullIsland && this.computedSymbols.skull > 2) {
        return 0;
      }

      const multiplier = this.currentCard === 'captain' ? 2 : 1;

      if (this.isSkullIsland) {
        return this.computedSymbols.skull * -100 * multiplier;
      }
      result += (Object.keys(this.computedSymbols) as (Symbol | 'animals')[]).reduce(
        (totalValue, key) => {
          const comboScore = getComboScore(
            this.computedSymbols[key],
            ['coin', 'diamond'].includes(key),
          );
          if (comboScore > 0) {
            valuedDices += this.computedSymbols[key];
          }
          totalValue += comboScore;
          return totalValue;
        },
        0,
      );
      if (valuedDices === 8) {
        result += 500;
      }
      return result * multiplier;
    },
    rollStats(): Roll {
      const result: Roll = {
        nbCaptains: 0,
        nbChests: 0,
        nbGuardians: 0,
        nbRoundsLost: 0,
        nbShipsLoose: 0,
        nbShipsWin: 0,
        petsTotal: 0,
        points: this.points,
        skullIslandTotal: 0,
        treasuresTotal: 0,
      };
      const isShipEncounter = ['ship2', 'ship3', 'ship4'].includes(this.currentCard || '');

      // nbRoundsLost
      if (this.points === 0) {
        result.nbRoundsLost++;
      } else if (this.points < 0) {
        // Ship lost & Skull Island
        if (isShipEncounter) {
          result.nbShipsLoose++;
        } else {
          result.skullIslandTotal -= this.points;
        }
      } else {
        // Ship win
        if (isShipEncounter) {
          result.nbShipsWin++;
        }

        const multiplier = this.currentCard === 'captain' ? 2 : 1;

        // Treasures
        result.treasuresTotal += getComboScore(this.symbols.coin, true) * multiplier;
        result.treasuresTotal += getComboScore(this.symbols.diamond, true) * multiplier;

        // Pets
        if (this.currentCard === 'animals') {
          result.petsTotal = getComboScore(this.symbols.monkey + this.symbols.parrot);
        } else {
          result.petsTotal += getComboScore(this.symbols.monkey) * multiplier;
          result.petsTotal += getComboScore(this.symbols.parrot) * multiplier;
        }
      }

      // nbCaptain
      if (this.currentCard === 'captain') {
        result.nbCaptains++;
      }

      // nbVault
      if (this.currentCard === 'chest') {
        result.nbChests++;
      }

      // nbWarden
      if (this.currentCard === 'guardian') {
        result.nbGuardians++;
      }

      return result;
    },
  },
});
