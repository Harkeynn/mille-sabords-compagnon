<template>
  <div class="dice-symbol">
    <h3>
      <img
        :src="imgPath"
        :alt="type"
        @click="isAddDisabled ? undefined : (symbols[type] += 1)"
        @touchend="isAddDisabled ? undefined : (symbols[type] += 1)"
        @contextmenu.prevent="isRemoveDisabled ? undefined : (symbols[type] -= 1)"
      />
    </h3>
    <button class="round" @click="symbols[type] -= 1" :disabled="isRemoveDisabled">-</button>
    <span>{{ symbols[type] }}</span>
    <button class="round" @click="symbols[type] += 1" :disabled="isAddDisabled">+</button>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Symbol } from '@/utils/types';
import { mapState, mapWritableState } from 'pinia';
import { useRollStore } from '@/stores';

export default defineComponent({
  name: 'DiceSymbol',
  props: {
    type: {
      required: true,
      type: String as PropType<Symbol>,
    },
  },
  computed: {
    ...mapState(useRollStore, ['isSkullIsland']),
    ...mapState(useRollStore, ['computedSymbols']),
    ...mapWritableState(useRollStore, ['symbols']),
    isRemoveDisabled() {
      if (this.isSkullIsland && this.type === 'skull') {
        return this.computedSymbols.skull < 5;
      }
      return this.symbols[this.type] < 1;
    },
    isAddDisabled() {
      return (
        (Object.values(this.symbols).reduce((result: number, value: number) => {
          result += value;
          return result;
        }, 0) as number) > 7
      );
    },
    imgPath() {
      return new URL(`../assets/img/symbols/${this.type}.png`, import.meta.url).href;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';

.dice-symbol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25rem 0.5rem;

  h3 {
    flex: 1 1 100%;
    text-align: center;
    margin-bottom: 0;
    margin-top: 10px;
    display: flex;
    justify-content: center;

    img {
      border: 2px solid $main;
      border-radius: 10%;
      cursor: pointer;
    }
  }
}
</style>
