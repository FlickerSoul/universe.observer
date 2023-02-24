<script setup lang="ts">
import { computed } from 'vue'
import { useCommStore } from '../store'

const { tagName } = defineProps({
  tagName: { type: String, required: true },
})

const comm = useCommStore()
const model = computed({
  get() {
    return comm.isTagSelected(tagName)
  },
  set(val) {
    comm.changeTag(tagName, val)
  },
})
</script>

<template>
  <button
    class="tag-selector flex gap-1"
    style="grid-template-columns: max-content auto;"
    @click="model = !model"
  >
    <span
      :class="model ? 'i-mdi-checkbox-marked-outline' : 'i-mdi-checkbox-blank-outline'"
      class="align-middle cursor-pointer"
    />
    <span class="break-words align-middle text-sm">
      {{ tagName }}
    </span>
  </button>
</template>

<style scoped lang="sass">
.tag-selector
  background-color: transparent
  border: none
  color: inherit
  font: inherit
</style>
