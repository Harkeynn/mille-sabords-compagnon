<template>
  <div>
    <Teleport to="body">
      <transition name="card-selection-">
        <div class="card-selection--overlay" v-if="cardSelection" @click="cardSelection = false">
          <ul class="card-selection--modal" @click.stop>
            <li v-for="card of cards" :key="card" @click="selectCard(card)">
              <img :src="getCardImg(card)" :alt="card" />
              <span>{{ getCardLabel(card) }}</span>
            </li>
          </ul>
        </div>
      </transition>
    </Teleport>
    <div class="current-card" @click="cardSelection = true" :style="cardPreview">
      {{ getCardLabel(currentCard) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Card } from '@/utils/types'
import { mapWritableState } from 'pinia'
import { useRollStore } from '@/stores'

export default defineComponent({
  name: 'TheCurrentCard',
  data() {
    return {
      cards: [
        'ship2',
        'ship3',
        'ship4',
        'skull1',
        'skull2',
        'guardian',
        'chest',
        'captain',
        'coin',
        'diamond',
        'animals'
      ] as Card[],
      cardSelection: false
    }
  },
  computed: {
    ...mapWritableState(useRollStore, ['currentCard']),
    cardPreview() {
      let imgPath = new URL('../assets/img/cards/all-preview.png', import.meta.url).href
      if (this.currentCard) {
        imgPath = new URL(`../assets/img/cards/${this.currentCard}-preview.png`, import.meta.url)
          .href
      }
      return {
        backgroundImage: `linear-gradient(to left, transparent 20%, #222 70%, #222), url("${imgPath}")`
      }
    }
  },
  methods: {
    getCardLabel(card: Card | null) {
      switch (card) {
        case 'chest':
          return 'Coffre'
        case 'captain':
          return 'Capitaine'
        case 'skull1':
          return '1 tete de mort'
        case 'skull2':
          return '2 tetes de mort'
        case 'guardian':
          return 'Gardienne'
        case 'ship2':
          return 'Bateau (2)'
        case 'ship3':
          return 'Bateau (3)'
        case 'ship4':
          return 'Bateau (4)'
        case 'coin':
          return 'Piece'
        case 'diamond':
          return 'Diamant'
        case 'animals':
          return 'Animaux'
        default:
          return 'Selectionner une carte'
      }
    },
    getCardImg(card: Card) {
      return new URL(`../assets/img/cards/${card}.png`, import.meta.url).href
    },
    selectCard(card: Card) {
      this.currentCard = card
      this.cardSelection = false
    }
  }
})
</script>

<style lang="scss" scoped>
.current-card {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  color: #fff;
  background-position: right;
  cursor: pointer;
  border-radius: 4px;
}

.card-selection {
  &--overlay {
    position: fixed;
    top: 0;
    height: 100%;
    left: 0;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.3);
    backdrop-filter: blur(2px);
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &--modal {
    background: #fff;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12),
      0 1px 5px 0 rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    transition: 0.3s;
    li {
      max-width: 200px;
      cursor: pointer;
      position: relative;
      display: flex;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        position: relative;
        z-index: 0;
      }

      span {
        position: absolute;
        bottom: 0.5rem;
        z-index: 2;
        left: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        transition: 0.3s;
      }

      &::after {
        content: '';
        display: inline-block;
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
        height: 20%;
        background: linear-gradient(to top, #222 20%, transparent);
        transition: 0.3s;
      }

      &:hover {
        span {
          transform: translateY(-1rem);
        }

        &::after {
          height: 40%;
        }
      }
    }
  }
  &--enter-from,
  &--leave-to {
    opacity: 0;

    .card-selection--modal {
      transform: scale(0);
    }
  }
}
</style>