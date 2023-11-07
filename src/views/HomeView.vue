<template>
  <main>
    <GameRecap />
    <ThePlayerList />
    <div class="current-roll" v-if="gameStarted">
      <TheCurrentCard />
      <label for="isSkullIsland" class="skull-island-toggler">
        <span>Ile de la Tete de Mort <i>ß</i></span>
        <input type="checkbox" v-model="isSkullIsland" name="isSkullIsland" id="isSkullIsland" />
      </label>
      <DiceSymbol v-for="symbol of symbolKeys" :key="symbol" :type="symbol" />
      <AnimatedNumber :value="points" />
      <button @click="reset">Reinitialiser</button>
      <button @click="validate" :disabled="cantValidate">Valider</button>
    </div>
  </main>
</template>

<script lang="ts">
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import DiceSymbol from '@/components/DiceSymbol.vue'
import GameRecap from '@/components/GameRecap.vue'
import TheCurrentCard from '@/components/TheCurrentCard.vue'
import ThePlayerList from '@/components/ThePlayerList.vue'
import { useGameStore, usePlayersStore, useRollStore } from '@/stores'
import type { HistoryItem, Player, Symbol } from '@/utils/types'
import { mapState, mapWritableState } from 'pinia'
import { v4 as uuid } from 'uuid'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    DiceSymbol,
    TheCurrentCard,
    ThePlayerList,
    AnimatedNumber,
    GameRecap
  },
  computed: {
    ...mapState(useRollStore, ['points']),
    ...mapState(useGameStore, ['gameStarted']),
    ...mapWritableState(useGameStore, ['history']),
    ...mapWritableState(useRollStore, ['currentCard', 'symbols', 'isSkullIsland']),
    ...mapWritableState(usePlayersStore, ['players', 'currentPlayerId']),
    symbolKeys() {
      return Object.keys(this.symbols) as Symbol[]
    },
    cantValidate() {
      const diceNb = Object.values(this.symbols).reduce((result: number, value: number) => {
        result += value
        return result
      }, 0)
      return !this.currentPlayerId || !this.currentCard || diceNb !== 8
    }
  },
  methods: {
    reset() {
      this.currentPlayerId = null
      this.currentCard = null
      this.symbols = {
        skull: 0,
        sword: 0,
        parrot: 0,
        monkey: 0,
        diamond: 0,
        coin: 0
      }
      this.isSkullIsland = false
    },
    validate() {
      const currentPlayer: Player | undefined = this.players.find(
        ({ id }) => id === this.currentPlayerId
      )
      if (!currentPlayer) {
        this.reset()
        return
      }
      if (this.isSkullIsland) {
        this.players
          .filter(({ id }) => id !== this.currentPlayerId)
          .forEach((player) => {
            player.score += this.points
            if (player.score < 0) {
              player.score = 0
            }
          })
      } else {
        currentPlayer.score += this.points
        if (currentPlayer.score < 0) {
          currentPlayer.score = 0
        }
      }
      this.history.push({
        id: uuid(),
        playerId: currentPlayer.id,
        score: this.points
      } as HistoryItem)
      this.reset()
    }
  },
  watch: {
    isSkullIsland() {
      if (this.isSkullIsland) {
        this.symbols.skull = 4
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';

main {
  display: grid;
  grid-template-columns: auto auto;
  gap: 1rem;
  max-height: 100%;
}

.current-roll {
  height: 100%;
  background: rgba($color: #fff, $alpha: 0.5);
  padding: 1rem;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: min-content;
  gap: 10px;
  margin-bottom: 10px;

  & > *:nth-child(-n + 2),
  & > *:nth-last-child(3) {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  & > span {
    font-size: 3rem;
    font-weight: bold;
    display: block;
    text-align: center;
  }

  .skull-island-toggler {
    display: flex;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    justify-content: center;
    height: 50px;

    input {
      display: none;
    }

    span {
      display: flex;
      align-items: center;
      z-index: 2;
      position: relative;

      i {
        padding-left: 0.5rem;
        transition: 0.3s;
        font-style: normal;
        font-size: 2rem;
        opacity: 0;
      }
    }

    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      height: 100%;
      left: 0;
      width: 100%;
      border-radius: 4px;
      background: linear-gradient(to left, #fff5 50%, $main 50%);
      background-size: 220%;
      background-position: 95%;
      transition: 0.3s;
    }

    &:hover::after {
      background-position: 85%;
    }

    &:has(input:checked) {
      span {
        color: #fff;

        i {
          opacity: 1;
        }
      }

      &::after {
        background-position: left;
      }
    }
  }
}

@media screen and (max-width: 700px) {
  main {
    display: flex;
    // grid-template-columns: auto auto;
    flex-direction: column;
    gap: 1rem;
    max-height: none;
    max-width: 100%;
  }
}
</style>
