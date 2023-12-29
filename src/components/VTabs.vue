<template>
  <div class="v-tabs">
    <ul>
      <li v-for="tab of tabs" :key="tab.key" :ref="tab.key" @click="currentTab = tab.key">
        {{ tab.title }}
      </li>
      <li
        class="highlighter"
        :style="{ left: `${highlightPosition.left}px`, width: `${highlightPosition.width}px` }"
      ></li>
    </ul>
    <slot :name="currentTab" />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VTabs',
  props: {
    modelValue: {
      type: String as PropType<String | null>,
    },
    tabs: {
      type: Array as PropType<Array<{ key: string; title: string }>>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      highlightPosition: {
        left: 0,
        width: 0,
      },
    };
  },
  computed: {
    currentTab: {
      get() {
        return this.modelValue;
      },
      set(value: string | null) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    setupHighlight() {
      const tabRef = (
        (this.$refs[this.currentTab as keyof typeof this.$refs] || []) as HTMLLIElement[]
      )[0];
      if (tabRef) {
        this.highlightPosition = {
          left: tabRef.offsetLeft,
          width: tabRef.offsetWidth,
        };
      }
    },
  },
  watch: {
    currentTab() {
      this.setupHighlight();
    },
  },
  mounted() {
    this.currentTab = this.tabs[0].key;
    this.setupHighlight();
  },
});
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables';
.v-tabs {
  width: 100%;

  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
    padding-bottom: 2px;
    position: relative;
    overflow: auto;

    li {
      flex: 0 0 auto;
      white-space: nowrap;
      min-width: 25px;
      text-align: center;
      cursor: pointer;

      &:not(.highlighter) {
        padding: 2px 10px;
      }

      &.highlighter {
        position: absolute;
        display: inline-block;
        height: 2px;
        bottom: 0;
        background-color: $main;
        transition: 0.3s;
      }
    }
  }
}
</style>
