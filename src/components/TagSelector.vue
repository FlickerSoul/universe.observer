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
    class="tag-selector grid cursor"
    style="grid-template-columns: max-content auto;"
    @click="model = !model"
  >
    <div :class="model ? 'i-mdi-checkbox-marked-outline' : 'i-mdi-checkbox-blank-outline'" class="mr-2 align-middle" />
    <div class="break-words align-middle text-sm">
      {{ tagName }}
    </div>
  </button>
</template>

<style scoped lang="sass">
.tag-selector
  background-color: transparent
  border: none
  color: inherit
  font: inherit
</style>
