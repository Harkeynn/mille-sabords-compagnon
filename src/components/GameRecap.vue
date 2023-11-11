<template>
  <VModal v-model="showResult" hideCloseButton persistent>
    <div class="game-recap-container">
      <h2>Vainqueur{{ winners.length > 1 ? 's' : '' }} :</h2>
      <h3>{{ winnersName }}</h3>
      <div v-if="displayedStat" class="game-stats-container">
        <transition name="stat">
          <div :key="displayedStat">
            <h4>{{ statLabels[displayedStat].title }}</h4>
            <p>
              {{ stats[displayedStat].playerName }} {{ statLabels[displayedStat].subtitle }} ({{
                stats[displayedStat].points
              }}{{ statLabels[displayedStat].unit ? ` ${statLabels[displayedStat].unit}` : '' }})
            </p>
          </div>
        </transition>
      </div>
      <button @click="showResult = false">OK</button>
    </div>
  </VModal>
</template>

<script lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';
import type { BestStats, Stats } from '@/utils/types';
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import VModal from './VModal.vue';
import { Player } from '@/utils/types';

export default defineComponent({
  name: 'GameRecap',
  components: { VModal },
  data() {
    return {
      showResult: false,
      statInterval: null,
      displayedStat: null,
      statLabels: {
        bestRound: {
          title: "Tireur d'elite",
          subtitle: 'a marque le plus de points en un tour',
          unit: 'points',
        },
        nbCaptains: {
          title: 'Amis haut places',
          subtitle: 'a pioche le plus de capitaines',
        },
        nbChests: {
          title: 'Prudent',
          subtitle: 'a pioche le plus de coffres',
        },
        nbGuardians: {
          title: 'Fossoyeur',
          subtitle: 'a pioche le plus de gardiens',
        },
        nbRoundsLost: {
          title: 'Rat de cale',
          subtitle: 'a perdu le plus de tours',
        },
        nbShipsLoose: {
          title: 'Nourriture pour poissons',
          subtitle: 'a perdu le plus de batailles navales',
        },
        nbShipsWin: {
          title: 'Terreur des mers',
          subtitle: 'a gagne le plus de batailles navales',
        },
        petsTotal: {
          title: 'Zoologue',
          subtitle: 'a marque le plus de points avec les animaux',
          unit: 'points',
        },
        skullIslandTotal: {
          title: 'Maleficieur',
          subtitle: "a ete le plus souvent sur l'Ile de la Tete de Mort",
          unit: 'fois',
        },
        treasuresTotal: {
          title: 'Plein aux as',
          subtitle: 'a marque le plus de points avec les richesses',
          unit: 'points',
        },
      } as Record<keyof Stats, { title: string; subtitle: string; unit?: string }>,
    };
  },
  computed: {
    ...mapState(useGameStore, ['gameStarted']),
    ...mapState(usePlayersStore, ['players', 'winners']),
    winnersName(): string {
      return this.winners.map(({ name }) => name).join(', ');
    },
    stats(): BestStats {
      return this.players.reduce((result: BestStats, player: Player) => {
        Object.keys(this.statLabels).forEach((key: keyof Stats) => {
          if (player[key] > 0 && (!result[key] || result[key].points < player[key])) {
            result[key] = {
              playerName: player.name,
              points: player[key],
            };
          }
        });
        return result;
      }, {});
    },
  },
  methods: {
    setupDisplayedStat() {
      const statsArray = Object.keys(this.stats);
      const statIndex = statsArray.indexOf(this.displayedStat);
      this.displayedStat = statsArray[statIndex === statsArray.length - 1 ? 0 : statIndex + 1];
    },
  },
  watch: {
    gameStarted() {
      if (!this.gameStarted) {
        this.showResult = true;
        this.setupDisplayedStat();
        this.statInterval = setInterval(() => {
          this.setupDisplayedStat();
        }, 5000);
      }
    },
  },
  beforeUnmount() {
    clearInterval(this.statInterval);
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

.game-stats-container {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: flex-start;
  width: 500px;
  max-width: calc(100vw - 20px);
  height: 120px;

  h4,
  p {
    margin-top: 0;
    text-align: center;
  }
}

.stat-enter-active,
.stat-leave-active {
  transition: 0.3s;
}

.stat-leave-active {
  position: absolute;
}

.stat-enter-from,
.stat-leave-to {
  opacity: 0;
}

.stat-enter-from {
  transform: translateX(20px);
}

.stat-leave-to {
  transform: translateX(-20px);
}
</style>
