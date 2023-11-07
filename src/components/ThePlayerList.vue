<template>
  <ul
    :style="{
      top: currentPlayerId ? `calc((48px + 1rem) * -${players.length + 0.667})` : undefined,
      position: currentPlayerId ? 'sticky' : 'relative'
    }"
  >
    <li
      v-for="player of players"
      :key="player.id"
      @click="currentPlayerId = player.id"
      :class="{ active: currentPlayerId === player.id }"
    >
      <p>
        <span>{{ player.name }}</span>
        <transition name="fade-right">
          <AnimatedNumber v-if="gameStarted" :value="player.score" />
        </transition>
      </p>
      <transition name="fade-right">
        <button
          class="round"
          style="font-size: 1rem; width: 2rem; height: 2rem"
          v-if="!gameStarted"
          @click="removePlayer(player.id)"
        >
          x
        </button>
      </transition>
    </li>
    <li>
      <form @submit.prevent v-if="!gameStarted">
        <label>
          <input type="text" v-model="newPlayerName" placeholder="Nom du joueur" maxlength="15" />
        </label>
        <button @click="addPlayer" :disabled="isNewPlayerDisabled">Ajouter un joueur</button>
      </form>
      <div class="history-actions" v-else>
        <button @click="undo" :disabled="history.length === 0">
          <FontAwesomeIcon :icon="['fas', 'clock-rotate-left']" />
        </button>
        <button
          @click="redo"
          :style="{
            transform: 'scaleX(-1)'
          }"
          :disabled="reversedActions.length === 0"
        >
          <FontAwesomeIcon :icon="['fas', 'clock-rotate-left']" />
        </button>
      </div>
      <button @click="toggleGame" :disabled="!!newPlayerName || players.length < 2">
        {{ gameStarted ? 'Arreter' : 'Demarrer' }} la partie
      </button>
    </li>
    <VModal v-model="showWarning" hideCloseButton>
      <div class="endgame-warning">
        <p>Voulez-vous vraiment terminer cette partie ?</p>
        <div>
          <button @click="showWarning = false">Non</button>
          <button @click="endGame">Oui</button>
        </div>
      </div>
    </VModal>
  </ul>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useGameStore, usePlayersStore } from '@/stores'
import type { HistoryItem, Player } from '@/utils/types'
import { mapWritableState } from 'pinia'
import { v4 as uuid } from 'uuid'
import { defineComponent } from 'vue'
import AnimatedNumber from './AnimatedNumber.vue'
import VModal from './VModal.vue'

export default defineComponent({
  name: 'ThePlayerList',
  components: {
    AnimatedNumber,
    FontAwesomeIcon,
    VModal
  },
  data() {
    return {
      newPlayerName: '',
      showWarning: false
    }
  },
  computed: {
    ...mapWritableState(usePlayersStore, ['players', 'currentPlayerId']),
    ...mapWritableState(useGameStore, ['gameStarted', 'history', 'reversedActions']),
    isNewPlayerDisabled() {
      const trimedName = this.newPlayerName.replace(/^\s+|\s+$/g, '')
      const alreadyExist = this.players
        .map(({ name }) => name.replace(/^\s+|\s+$/g, ''))
        .includes(trimedName)
      return !trimedName || trimedName.length === 0 || alreadyExist
    }
  },
  methods: {
    removePlayer(playerId: string) {
      const indexToRemove = this.players.findIndex(({ id }) => id === playerId)
      this.players.splice(indexToRemove, 1)
    },
    addPlayer() {
      this.players.push({
        id: uuid(),
        name: this.newPlayerName.replace(/^\s+|\s+$/g, ''),
        score: 0,
        bestRound: 0,
        nbBoatsLoose: 0,
        nbBoatsWin: 0,
        nbCaptain: 0,
        nbCoins: 0,
        nbDiamonds: 0,
        nbPet: 0,
        nbVault: 0,
        nbWarden: 0,
        skullIslandTotal: 0
      } as Player)
      this.newPlayerName = ''
    },
    toggleGame() {
      // Reset players' score when game starts
      if (this.gameStarted) {
        this.showWarning = true
      } else {
        this.players.forEach((player: Player) => {
          player.score = 0
        })
        this.gameStarted = true
      }
    },
    endGame() {
      this.showWarning = false
      this.gameStarted = false
    },
    undo() {
      if (this.history.length > 0) {
        const action: HistoryItem = this.history.splice(this.history.length - 1, 1)[0]
        this.reversedActions.push(action)

        this.players = this.players.map((player: Player) => {
          if (player.id !== action.playerId) {
            return player
          }
          return {
            ...player,
            score: player.score - action.score
          }
        })
      }
    },
    redo() {
      if (this.reversedActions.length > 0) {
        const action: HistoryItem = this.reversedActions.splice(
          this.reversedActions.length - 1,
          1
        )[0]
        this.history.push(action)

        this.players = this.players.map((player: Player) => {
          if (player.id !== action.playerId) {
            return player
          }
          return {
            ...player,
            score: player.score + action.score
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';

ul {
  height: 100%;
  z-index: 1;
  position: sticky;
  padding: 1rem;
  border-radius: 4px;
  background: rgba($color: #fff, $alpha: 0.5);
  display: flex;
  flex-direction: column;
  min-width: 316px;
  gap: 1rem;
  backdrop-filter: blur(4px);
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    p {
      height: 32px;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      width: 100%;

      span {
        transition: 0.3s;

        &:nth-of-type(2) {
          font-weight: bold;
        }
      }
    }

    &:last-of-type {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      & > * {
        width: 100%;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        input {
          width: 100%;
          line-height: 2rem;
        }
      }

      .history-actions {
        display: flex;
        gap: 0.5rem;

        button {
          flex: 1;
        }
      }
    }

    &:not(:last-of-type) {
      padding: 0.5rem;
      cursor: pointer;

      &::after {
        content: '';
        z-index: -1;
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

      &.active {
        position: sticky;
        z-index: 1;
        top: 1rem;
        bottom: -2000px;
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
}

.fade-right-enter-active,
.fade-right-leave-active {
  transition: 0.3s;
}

.fade-right-leave-active {
  position: absolute;
  right: 0.5rem;
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(0.5rem);
}

.endgame-warning {
  p {
    margin-top: 0;
  }

  div {
    display: flex;
    justify-content: space-around;
  }
}
</style>
