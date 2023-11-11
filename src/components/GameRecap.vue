<template>
  <VModal v-model="showResult" hideCloseButton persistent>
    <div class="game-recap-container">
      <h2>Vainqueur{{ winners.length > 1 ? 's' : '' }} :</h2>
      <h3>{{ winnersName }}</h3>
      <button @click="showResult = false">OK</button>
    </div>
  </VModal>
</template>

<script lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import VModal from './VModal.vue';

export default defineComponent({
  name: 'GameRecap',
  components: { VModal },
  data() {
    return {
      showResult: false,
    };
  },
  computed: {
    ...mapState(useGameStore, ['gameStarted']),
    ...mapState(usePlayersStore, ['players', 'winners']),
    winnersName() {
      return this.winners.map(({ name }) => name).join(', ');
    },
  },
  watch: {
    gameStarted() {
      if (!this.gameStarted) {
        this.showResult = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.game-recap-container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }

  button {
    margin: 0 auto;
  }
}
</style>
