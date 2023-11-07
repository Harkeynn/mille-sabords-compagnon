<template>
  <teleport to="body">
    <transition name="v-modal-">
      <div
        class="v-modal--overlay"
        v-if="showModal"
        @click="persistent ? undefined : (showModal = false)"
      >
        <div class="v-modal--content" @click.stop>
          <button v-if="!hideCloseButton" class="round" @click="showModal = false">x</button>
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    hideCloseButton: Boolean,
    persistent: Boolean
  },
  emits: ['update:modelValue'],
  computed: {
    showModal: {
      get() {
        return this.modelValue
      },
      set(value: boolean) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.v-modal {
  &--overlay {
    z-index: 10;
    position: fixed;
    top: 0;
    height: 100%;
    left: 0;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.3);
    backdrop-filter: blur(8px);
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &--content {
    background: rgba(255, 255, 255, 0.5);
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12),
      0 1px 5px 0 rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    transition: 0.3s;
    overflow: hidden;
    position: relative;

    & > button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 1;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12),
        0 1px 5px 0 rgba(0, 0, 0, 0.2);
    }
  }
  &--enter-from,
  &--leave-to {
    opacity: 0;

    .v-modal--content {
      transform: scale(0);
    }
  }
}
</style>
