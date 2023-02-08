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
  <div class="tag-selector grid" style="grid-template-columns: max-content auto;">
    <input v-model="model" type="checkbox" class="mr-2 align-middle">
    <div class="break-words align-middle">
      {{ tagName }}
    </div>
  </div>
</template>
