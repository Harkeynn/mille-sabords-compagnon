<template>
  <ul>
    <li
      v-for="player of players"
      :key="player.id"
      @click="currentPlayerId = player.id"
      :class="{ active: currentPlayerId === player.id }"
    >
      <span>{{ player.name }} - <AnimatedNumber :value="player.score" /></span>
      <button
        class="round"
        style="font-size: 1rem; width: 2rem; height: 2rem"
        @click="removePlayer(player.id)"
      >
        x
      </button>
    </li>
    <li>
      <form @submit.prevent>
        <label>
          <input type="text" v-model="newPlayerName" placeholder="Nom du joueur" />
        </label>
        <button @click="addPlayer" :disabled="isNewPlayerDisabled">Ajouter un joueur</button>
      </form>
    </li>
  </ul>
</template>

<script lang="ts">
import { usePlayersStore } from '@/stores'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import AnimatedNumber from './AnimatedNumber.vue'
import { v4 as uuid } from 'uuid'

export default defineComponent({
  name: 'ThePlayerList',
  components: {
    AnimatedNumber
  },
  data() {
    return {
      newPlayerName: ''
    }
  },
  computed: {
    ...mapWritableState(usePlayersStore, ['players', 'currentPlayerId']),
    isNewPlayerDisabled() {
      const alreadyExist = this.players.map(({ name }) => name).includes(this.newPlayerName)
      return !this.newPlayerName || this.newPlayerName.length === 0 || alreadyExist
    }
  },
  methods: {
    removePlayer(playerId: string) {
      const indexToRemove = this.players.findIndex(({ id }) => id === playerId)
      this.players.splice(indexToRemove, 1)
    },
    addPlayer() {
      this.players.push({ id: uuid(), name: this.newPlayerName, score: 0 })
      this.newPlayerName = ''
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';

ul {
  height: 100%;
  padding: 1rem;
  border-radius: 4px;
  background: rgba($color: #fff, $alpha: 0.5);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    span {
      transition: 0.3s;
    }

    &:last-of-type {
      margin-top: auto;

      form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;

        input {
          width: 100%;
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
</style>
