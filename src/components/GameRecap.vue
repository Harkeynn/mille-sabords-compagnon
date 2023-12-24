<template>
  <VModal v-model="showResult" hideCloseButton persistent>
    <div class="game-recap-container">
      <h2>Vainqueur{{ winners.length > 1 ? 's' : '' }} :</h2>
      <h3>{{ winnersName }}</h3>
      <hr />
      <div v-if="displayedStat" class="game-stats-container">
        <transition name="stat">
          <ul v-if="displayAllStats" class="all-stats-container">
            <li v-for="(stat, key) of existingStats" :key="key">
              <h4>{{ statLabels[key].title }}</h4>
              <span>
                {{ stat?.playerName }} {{ statLabels[key].subtitle }} ({{ stat?.points
                }}{{ statLabels[key].unit ? ` ${statLabels[key].unit}` : '' }})
              </span>
            </li>
          </ul>
          <div v-else :key="displayedStat">
            <h4>{{ statLabels[displayedStat].title }}</h4>
            <p>
              {{ stats[displayedStat]?.playerName }} {{ statLabels[displayedStat].subtitle }} ({{
                stats[displayedStat]?.points
              }}{{ statLabels[displayedStat].unit ? ` ${statLabels[displayedStat].unit}` : '' }})
            </p>
          </div>
        </transition>
      </div>
      <transition name="fade">
        <button v-if="!displayAllStats" @click="displayAllStats = true">Afficher les stats</button>
      </transition>
      <button @click="showResult = false">OK</button>
    </div>
  </VModal>
</template>

<script lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';
import type { BestStats, Player, StatItem, Stats } from '@/utils/types';
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import VModal from './VModal.vue';

export default defineComponent({
  name: 'GameRecap',
  components: { VModal },
  data() {
    return {
      showResult: false,
      statInterval: undefined as undefined | number,
      displayedStat: null as keyof Stats | null,
      displayAllStats: false,
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
        Object.keys(this.statLabels).forEach((key) => {
          const statKey = key as keyof Stats;
          if (player[statKey] > 0 && (result[statKey]?.points || 0) < player[statKey]) {
            result[statKey] = {
              playerName: player.name,
              points: player[statKey],
            };
          }
        });
        return result;
      }, {});
    },
    existingStats() {
      return (Object.keys(this.stats) as (keyof BestStats)[]).reduce(
        (result: BestStats, key: keyof BestStats) => {
          const value: StatItem | undefined = this.stats[key];
          if (value !== undefined) {
            result[key] = value;
          }
          return result;
        },
        {},
      );
    },
  },
  methods: {
    setupDisplayedStat() {
      const statsArray = Object.keys(this.stats);
      const statIndex = statsArray.indexOf(this.displayedStat as string);
      this.displayedStat = statsArray[
        statIndex === statsArray.length - 1 ? 0 : statIndex + 1
      ] as keyof Stats;
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
    displayAllStats() {
      clearInterval(this.statInterval);
    },
  },
  beforeUnmount() {
    clearInterval(this.statInterval);
  },
});
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';

.game-recap-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  h2 {
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
  }

  hr {
    width: calc(100% - 100px);
    border-color: #000;
    margin: 10px auto;
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
  min-height: 120px;
  max-height: 60vh;

  h4,
  p {
    margin-top: 0;
    text-align: center;
  }

  p {
    line-height: 1.2rem;
  }

  .all-stats-container {
    max-height: 60vh;
    overflow: auto;
    display: grid;
    grid-template-columns: minmax(250px, 1fr) minmax(250px, 1fr);
    gap: 10px;
    text-align: center;

    li {
      border-radius: 3px;
      overflow: hidden;

      h4 {
        color: #fff;
        margin-bottom: 0;
        background: $main;
        padding: 5px;
      }

      span {
        background: rgba($color: #fff, $alpha: 0.3);
        display: inline-block;
        padding: 10px;
      }
    }
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

.fade-leave-active {
  transition: 0.3s;
}

.fade-leave-to {
  opacity: 0;
}
</style>
