<template>
  <span>{{ displayValue }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gsap from 'gsap';

export default defineComponent({
  name: 'AnimatedNumber',
  props: { value: { type: Number, required: true } },
  data() {
    return {
      displayValue: this.value,
      tweenValue: this.value,
    };
  },

  watch: {
    value() {
      gsap.to(this, {
        tweenValue: this.value,
        onUpdate: () => {
          this.displayValue = Math.ceil(this.tweenValue);
        },
      });
    },
  },
});
</script>
