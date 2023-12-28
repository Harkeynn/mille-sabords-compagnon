<template>
  <VModal v-model="showResult" hideCloseButton persistent>
    <div class="game-recap-container">
      <h2>Vainqueur{{ winners.length > 1 ? 's' : '' }} :</h2>
      <h3>{{ winnersName }}</h3>
      <hr />
      <div class="game-stats-container">
        <transition name="stat">
          <VTabs
            v-if="displayAllStats"
            v-model="currentPlayerStats"
            :tabs="players.map(({ id, name }) => ({ key: id, title: name }))"
          >
            <template v-for="player of players" :key="player.id" v-slot:[player.id]>
              <ul class="player-stats-container">
                <li v-for="(label, key) of playerStatLabels" :key="key">
                  <span>{{ label }}</span
                  ><AnimatedNumber :value="player[key]" />
                </li>
              </ul>
            </template>
          </VTabs>
          <ul v-else class="all-stats-container">
            <li v-for="(stat, key) of existingStats" :key="key">
              <h4>{{ statLabels[key].title }}</h4>
              <span>
                {{ stat?.playerName }} {{ statLabels[key].subtitle }} ({{ stat?.points
                }}{{ statLabels[key].unit ? ` ${statLabels[key].unit}` : '' }})
              </span>
            </li>
          </ul>
        </transition>
      </div>
      <button @click="displayAllStats = !displayAllStats">
        {{ displayAllStats ? 'Retour aux stats de la partie' : 'Afficher les stats completes' }}
      </button>
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
import VTabs from './VTabs.vue';
import AnimatedNumber from './AnimatedNumber.vue';

export default defineComponent({
  name: 'GameRecap',
  components: { VModal, VTabs, AnimatedNumber },
  data() {
    return {
      currentPlayerStats: null,
      showResult: false,
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
      playerStatLabels: {
        score: 'Score final',
        bestRound: 'Meilleur tour',
        nbCaptains: 'Capitaine(s) pioche(s)',
        nbChests: 'Coffre(s) pioche(s)',
        nbGuardians: 'Gardien(s) pioche(s)',
        nbRoundsLost: 'Tour(s) perdu(s)',
        nbShipsLoose: 'Bataille(s) navale(s) perdue(s)',
        nbShipsWin: 'Bataille(s) navale(s) gagnee(s)',
        petsTotal: 'Point(s) gagne(s) grace aux animaux',
        skullIslandTotal: "Visite(s) sur l'Ile de la Tete de Mort",
        treasuresTotal: 'Point(s) gagne(s) grace aux richesses',
      },
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
  watch: {
    gameStarted() {
      if (!this.gameStarted) {
        this.showResult = true;
      }
    },
    'players.length'() {
      this.currentPlayerStats = this.players[0]?.id || null;
    },
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

  .player-stats-container {
    li {
      padding: 5px;
      display: flex;
      justify-content: space-between;

      &:nth-child(odd) {
        background: rgba($color: #000, $alpha: 0.2);
      }
    }
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
