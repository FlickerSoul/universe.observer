<script setup lang="ts">
import { computed } from 'vue'
import { useCommStore } from '../store'

const { tagName, delimiter } = defineProps({
  tagName: { type: String, required: true },
  delimiter: {
    type: String, default: '',
  },
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
  <div class="tag-selector">
    <span>{{ tagName }}</span> <span>{{ delimiter }}</span> <input v-model="model" type="checkbox">
  </div>
</template>
